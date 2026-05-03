import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";
import {
  fetchCompanyTickers,
  fetchCompanyFacts,
  fetchCompanySubmissions,
  searchFromTickers,
  extractMetricSeries,
} from "../utils/api";
import { METRIC_DEFS } from "../constants";

// ─── Initial state ────────────────────────────────────────────────────────────
const init = {
  searchQuery: "",
  searchResults: [],
  searchLoading: false,
  searchError: null,

  company: null, // { name, ticker, cik }
  companyInfo: null, // shaped from /submissions response
  metrics: {}, // { [metricKey]: { series, latest, growth } }

  loading: false,
  error: null,
  activeMetric: "revenue",
  activeTab: "overview",
};

// ─── Actions ──────────────────────────────────────────────────────────────────
const A = {
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  SET_SEARCH_RESULTS: "SET_SEARCH_RESULTS",
  SET_SEARCH_LOADING: "SET_SEARCH_LOADING",
  SET_SEARCH_ERROR: "SET_SEARCH_ERROR",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_COMPANY: "SET_COMPANY",
  SET_METRICS: "SET_METRICS",
  SET_ACTIVE_METRIC: "SET_ACTIVE_METRIC",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  CLEAR_COMPANY: "CLEAR_COMPANY",
  CLEAR_SEARCH: "CLEAR_SEARCH",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, { type, payload }) {
  switch (type) {
    case A.SET_SEARCH_QUERY:
      return { ...state, searchQuery: payload };
    case A.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: payload,
        searchLoading: false,
        searchError: null,
      };
    case A.SET_SEARCH_LOADING:
      return { ...state, searchLoading: payload };
    case A.SET_SEARCH_ERROR:
      return { ...state, searchError: payload, searchLoading: false };
    case A.SET_LOADING:
      return { ...state, loading: payload, error: null };
    case A.SET_ERROR:
      return { ...state, error: payload, loading: false };
    case A.SET_COMPANY:
      return {
        ...state,
        company: payload.company,
        companyInfo: payload.info,
        loading: false,
        error: null,
      };
    case A.SET_METRICS:
      return { ...state, metrics: payload };
    case A.SET_ACTIVE_METRIC:
      return { ...state, activeMetric: payload };
    case A.SET_ACTIVE_TAB:
      return { ...state, activeTab: payload };
    case A.CLEAR_COMPANY:
      return {
        ...state,
        company: null,
        companyInfo: null,
        metrics: {},
        error: null,
        activeTab: "overview",
      };
    case A.CLEAR_SEARCH:
      return {
        ...state,
        searchQuery: "",
        searchResults: [],
        searchError: null,
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);

  // Cache the tickers list in a ref so we only fetch it once per session.
  // First search hits the network; every subsequent search is instant.
  const tickersCacheRef = useRef(null);

  // ── Search ────────────────────────────────────────────────────────────────
  // Flow:
  //   1. GET https://www.sec.gov/files/company_tickers.json  (cached after 1st call)
  //   2. Filter the flat array by name / ticker / cik_str
  //   3. Return top 10, exact ticker matches first
  const searchCompanies = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      dispatch({ type: A.SET_SEARCH_RESULTS, payload: [] });
      return;
    }

    dispatch({ type: A.SET_SEARCH_LOADING, payload: true });
    dispatch({ type: A.SET_SEARCH_QUERY, payload: query });

    try {
      // Load tickers list once, then reuse from cache
      if (!tickersCacheRef.current) {
        tickersCacheRef.current = await fetchCompanyTickers();
        // tickersCacheRef.current is now:
        // { "0": { cik_str: 320193, ticker: "AAPL", title: "Apple Inc." }, ... }
      }

      const results = searchFromTickers(tickersCacheRef.current, query.trim());
      dispatch({ type: A.SET_SEARCH_RESULTS, payload: results });
    } catch (err) {
      dispatch({ type: A.SET_SEARCH_ERROR, payload: err.message });
    }
  }, []);

  // ── Load Company ──────────────────────────────────────────────────────────
  // Flow:
  //   1. company.cik is already padded to 10 digits from searchFromTickers
  //      e.g. company.cik = "0000320193"
  //
  //   2. Parallel fetch:
  //      a. GET /submissions/CIK0000320193.json   → metadata
  //      b. GET /api/xbrl/companyfacts/CIK0000320193.json → all XBRL figures
  //
  //   3. From facts, extract each metric:
  //      facts.facts["us-gaap"]["Revenues"]       → revenue series
  //      facts.facts["us-gaap"]["Assets"]         → assets series
  //      facts.facts["us-gaap"]["Liabilities"]    → liabilities series
  //      ... etc.
  const loadCompany = useCallback(async (company) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    dispatch({ type: A.CLEAR_COMPANY });

    try {
      // company.cik is already padded: "0000320193"
      const [rawInfo, facts] = await Promise.all([
        fetchCompanySubmissions(company.cik),
        fetchCompanyFacts(company.cik),
      ]);

      // Shape the submissions response for the UI
      const companyInfo = {
        name: rawInfo.name,
        cik: rawInfo.cik,
        sic: rawInfo.sic,
        sicDescription: rawInfo.sicDescription,
        stateOfIncorporation: rawInfo.stateOfIncorporation,
        exchanges: rawInfo.exchanges ?? [],
        fiscalYearEnd: rawInfo.fiscalYearEnd,
        filingCount: rawInfo.filings?.recent?.form?.length ?? 0,
      };

      dispatch({
        type: A.SET_COMPANY,
        payload: { company, info: companyInfo },
      });

      // Extract every metric from facts.facts["us-gaap"] / facts.facts["ifrs-full"]
      // Each METRIC_DEF has an ordered list of XBRL tags to try, e.g.:
      //   revenue → ["Revenues", "RevenueFromContractWithCustomerExcludingAssessedTax", ...]
      //   assets  → ["Assets"]
      //   liabilities → ["Liabilities"]
      const processed = {};

      for (const [key, def] of Object.entries(METRIC_DEFS)) {
        // EPS is stored under "USD/shares"; everything else under "USD"
        const preferredUnit = def.format === "decimal" ? "USD/shares" : "USD";

        const series = extractMetricSeries(facts, def.tags, preferredUnit);
        if (series.length === 0) continue; // company didn't report this metric

        const latest = series[series.length - 1];
        const prev = series.length >= 2 ? series[series.length - 2] : null;
        const growth =
          prev?.value != null
            ? ((latest.value - prev.value) / Math.abs(prev.value)) * 100
            : null;

        processed[key] = { series, latest, growth };
      }

      dispatch({ type: A.SET_METRICS, payload: processed });
    } catch (err) {
      dispatch({ type: A.SET_ERROR, payload: err.message });
    }
  }, []);

  const setActiveMetric = useCallback(
    (m) => dispatch({ type: A.SET_ACTIVE_METRIC, payload: m }),
    []
  );
  const setActiveTab = useCallback(
    (t) => dispatch({ type: A.SET_ACTIVE_TAB, payload: t }),
    []
  );
  const clearCompany = useCallback(
    () => dispatch({ type: A.CLEAR_COMPANY }),
    []
  );
  const clearSearch = useCallback(() => dispatch({ type: A.CLEAR_SEARCH }), []);

  return (
    <Ctx.Provider
      value={{
        ...state,
        searchCompanies,
        loadCompany,
        setActiveMetric,
        setActiveTab,
        clearCompany,
        clearSearch,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
