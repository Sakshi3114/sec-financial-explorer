import { SEC_BASE_URL, EFTS_BASE_URL } from "../constants";

const SEC_HEADERS = {
  "User-Agent": "SEC-Explorer/1.0 dev@example.com",
  Accept: "application/json",
};

/**
 * Pad CIK to 10 digits as required by SEC EDGAR
 */
export function padCIK(cik) {
  return String(cik).replace(/^0+/, "").padStart(10, "0");
}

/**
 * Fetch company facts (all financial data) for a given CIK
 */
export async function fetchCompanyFacts(cik) {
  const paddedCIK = padCIK(cik);
  const url = `${SEC_BASE_URL}/api/xbrl/companyfacts/CIK${paddedCIK}.json`;

  const res = await fetch(url, { headers: SEC_HEADERS });

  if (!res.ok) {
    if (res.status === 404)
      throw new Error(`Company with CIK ${cik} not found in SEC EDGAR.`);
    throw new Error(`SEC EDGAR API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetch company submissions (filings metadata) for a given CIK
 */
export async function fetchCompanySubmissions(cik) {
  const paddedCIK = padCIK(cik);
  const url = `${SEC_BASE_URL}/submissions/CIK${paddedCIK}.json`;

  const res = await fetch(url, { headers: SEC_HEADERS });

  if (!res.ok) {
    if (res.status === 404)
      throw new Error(`Company with CIK ${cik} not found.`);
    throw new Error(`SEC EDGAR API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Search companies by name using SEC full-text search
 */
export async function searchCompaniesByName(query) {
  const url = `${EFTS_BASE_URL}/hits.json?q=%22${encodeURIComponent(
    query
  )}%22&dateRange=custom&startdt=2020-01-01&forms=10-K`;

  try {
    const res = await fetch(url, { headers: SEC_HEADERS });
    if (!res.ok) throw new Error("Search failed");
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Search companies using the company_search endpoint
 */
export async function searchCompanyTickers(query) {
  // SEC provides a company tickers JSON
  const url = `${SEC_BASE_URL}/files/company_tickers.json`;

  const res = await fetch(url, { headers: SEC_HEADERS });
  if (!res.ok) throw new Error("Could not load company list");

  const data = await res.json();
  const q = query.toLowerCase();

  // data is an object keyed by index, each has { cik_str, ticker, title }
  const matches = Object.values(data)
    .filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.ticker.toLowerCase().includes(q) ||
        String(c.cik_str).includes(q)
    )
    .slice(0, 10)
    .map((c) => ({
      name: c.title,
      ticker: c.ticker,
      cik: String(c.cik_str).padStart(10, "0"),
    }));

  return matches;
}

/**
 * Extract time-series data for a specific XBRL concept
 * Returns array of { date, value, form, unit } sorted by date
 */
export function extractMetricSeries(factsData, tags, preferredUnit = "USD") {
  const usGaap = factsData?.facts?.["us-gaap"];
  if (!usGaap) return [];

  for (const tag of tags) {
    const concept = usGaap[tag];
    if (!concept?.units) continue;

    // Try preferred unit first, then any available unit
    const unitKeys = Object.keys(concept.units);
    const unitKey = unitKeys.includes(preferredUnit)
      ? preferredUnit
      : unitKeys[0];

    if (!unitKey) continue;

    const entries = concept.units[unitKey];
    if (!entries?.length) continue;

    // Filter annual filings (10-K) and dedupe by fiscal year end
    const annualMap = new Map();
    entries
      .filter(
        (e) => e.form === "10-K" && e.end && !e.start?.includes("instant")
      )
      .forEach((e) => {
        const existing = annualMap.get(e.end);
        // Prefer entries with accn (more recent filings)
        if (!existing || e.accn > existing.accn) {
          annualMap.set(e.end, e);
        }
      });

    const series = Array.from(annualMap.values())
      .map((e) => ({
        date: e.end,
        value: e.val,
        form: e.form,
        unit: unitKey,
        accn: e.accn,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10); // Last 10 years

    if (series.length > 0) return series;
  }

  return [];
}

/**
 * Get the latest value from a metric series
 */
export function getLatestValue(series) {
  if (!series?.length) return null;
  return series[series.length - 1];
}

/**
 * Format a financial value for display
 */
export function formatValue(value, format = "currency", unit = "USD") {
  if (value === null || value === undefined) return "—";

  if (format === "decimal") {
    return Number(value).toFixed(2);
  }

  if (format === "currency") {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";

    if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
    if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
    if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
    return `${sign}$${abs.toFixed(0)}`;
  }

  return String(value);
}

/**
 * Calculate YoY growth between two values
 */
export function calcGrowth(current, previous) {
  if (!previous || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Format growth percentage
 */
export function formatGrowth(pct) {
  if (pct === null || pct === undefined) return null;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}
