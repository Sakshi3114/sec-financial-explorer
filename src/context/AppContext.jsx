import { createContext, useContext, useReducer, useCallback } from "react";
import {
  MOCK_COMPANY,
  MOCK_METRICS,
  MOCK_SEARCH_RESULTS,
} from "../data/mockData";

// ── State shape ──────────────────────────────────────────────────────────────
const init = {
  // search
  searchQuery: "",
  searchResults: [],
  searchLoading: false,
  searchError: null,
  // company
  company: null,
  companyInfo: null,
  metrics: {},
  // ui
  loading: false,
  error: null,
  activeMetric: "revenue",
  activeTab: "overview",
  useMock: true, // ← flip to false when wiring real API
};

// ── Actions ──────────────────────────────────────────────────────────────────
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

// ── Reducer ──────────────────────────────────────────────────────────────────
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

// ── Context ──────────────────────────────────────────────────────────────────
const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);

  // Search companies (mock)
  const searchCompanies = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      dispatch({ type: A.SET_SEARCH_RESULTS, payload: [] });
      return;
    }
    dispatch({ type: A.SET_SEARCH_LOADING, payload: true });
    dispatch({ type: A.SET_SEARCH_QUERY, payload: query });
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 400));
    const q = query.toLowerCase();
    const results = MOCK_SEARCH_RESULTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q)
    );
    dispatch({ type: A.SET_SEARCH_RESULTS, payload: results });
  }, []);

  // Load company data (mock)
  const loadCompany = useCallback(async (company) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    dispatch({ type: A.CLEAR_COMPANY });
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));
    dispatch({ type: A.SET_COMPANY, payload: { company, info: MOCK_COMPANY } });
    dispatch({ type: A.SET_METRICS, payload: MOCK_METRICS });
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
