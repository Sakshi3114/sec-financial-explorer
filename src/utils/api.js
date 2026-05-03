// ─────────────────────────────────────────────────────────────────────────────
// All SEC EDGAR requests go through the Vite dev proxy (/sec-api → data.sec.gov)
// so the browser never makes a cross-origin request directly to sec.gov.
// In production, configure the same rewrites in vercel.json / netlify.toml.
// ─────────────────────────────────────────────────────────────────────────────

const SEC_PROXY = "/sec-api"; // proxied → https://data.sec.gov
const TICKERS_PROXY = "/sec-tickers"; // proxied → https://www.sec.gov

// Only the headers that survive a proxy passthrough
const HEADERS = { Accept: "application/json" };

// ─── Shared fetch wrapper ─────────────────────────────────────────────────────
async function secFetch(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    if (res.status === 404)
      throw new Error(
        "Company not found in SEC EDGAR. Try a different name or CIK."
      );
    if (res.status === 429)
      throw new Error(
        "SEC EDGAR rate limit reached. Please wait a moment and try again."
      );
    throw new Error(`SEC EDGAR error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// ─── Step 1: Fetch the full ticker list ──────────────────────────────────────
// www.sec.gov/files/company_tickers.json  →  proxied via /sec-tickers
// Response: { "0": { cik_str, ticker, title }, "1": ... }
export function fetchCompanyTickers() {
  return secFetch(`${TICKERS_PROXY}/files/company_tickers.json`);
}

// ─── Step 2: Filter the ticker list client-side ───────────────────────────────
// Returns up to 10 matches sorted with exact ticker hits first.
export function searchFromTickers(data, query) {
  const companies = Object.values(data);
  const q = query.toLowerCase().trim();

  return companies
    .filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.ticker.toLowerCase() === q ||
        c.ticker.toLowerCase().startsWith(q) ||
        String(c.cik_str).includes(q)
    )
    .sort((a, b) => {
      const aExact = a.ticker.toLowerCase() === q;
      const bExact = b.ticker.toLowerCase() === q;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.title.localeCompare(b.title);
    })
    .slice(0, 10)
    .map((c) => ({
      name: c.title,
      ticker: c.ticker,
      // Always pad to 10 digits — this is what the companyfacts URL expects
      cik: c.cik_str.toString().padStart(10, "0"),
    }));
}

// ─── Step 3: Company metadata ─────────────────────────────────────────────────
// data.sec.gov/submissions/CIK{10-digit}.json  →  proxied via /sec-api
export function fetchCompanySubmissions(cik) {
  const padded = cik.toString().padStart(10, "0");
  return secFetch(`${SEC_PROXY}/submissions/CIK${padded}.json`);
}

// ─── Step 4: All XBRL financial facts ────────────────────────────────────────
// data.sec.gov/api/xbrl/companyfacts/CIK{10-digit}.json  →  proxied via /sec-api
export function fetchCompanyFacts(cik) {
  const padded = cik.toString().padStart(10, "0");
  return secFetch(`${SEC_PROXY}/api/xbrl/companyfacts/CIK${padded}.json`);
}

// ─── Step 5: Extract annual time-series from XBRL facts ──────────────────────
//
// facts.facts["us-gaap"]["Revenues"]    → revenue
// facts.facts["us-gaap"]["Assets"]      → assets
// facts.facts["us-gaap"]["Liabilities"] → liabilities
//
// Filters to 10-K rows only, validates ~annual duration (300–400 days),
// dedupes per fiscal-year-end keeping the latest amendment, returns last 10 yrs.
export function extractMetricSeries(facts, tags, preferredUnit = "USD") {
  const namespaces = ["us-gaap", "ifrs-full"];

  for (const tag of tags) {
    for (const ns of namespaces) {
      const concept = facts?.facts?.[ns]?.[tag];
      if (!concept?.units) continue;

      // Pick best unit bucket
      const unitKeys = Object.keys(concept.units);
      const unitKey = unitKeys.includes(preferredUnit)
        ? preferredUnit
        : unitKeys.includes("USD")
        ? "USD"
        : unitKeys[0];

      if (!unitKey) continue;

      const entries = concept.units[unitKey];
      if (!entries?.length) continue;

      // Dedupe by fiscal-year-end, keep latest accn per end-date
      const byEnd = new Map();
      for (const e of entries) {
        if (e.form !== "10-K") continue;
        if (!e.start || !e.end) continue; // need duration rows

        // Reject quarterly / multi-year periods
        const days =
          (new Date(e.end) - new Date(e.start)) / (1000 * 60 * 60 * 24);
        if (days < 300 || days > 400) continue;

        const existing = byEnd.get(e.end);
        if (!existing || e.accn > existing.accn) byEnd.set(e.end, e);
      }

      if (byEnd.size === 0) continue;

      const series = Array.from(byEnd.values())
        .map((e) => ({
          date: e.end,
          value: e.val,
          form: e.form,
          unit: unitKey,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-10); // last 10 fiscal years

      if (series.length > 0) return series;
    }
  }

  return [];
}

// ─── Display formatters ───────────────────────────────────────────────────────

export function formatValue(value, format = "currency") {
  if (value === null || value === undefined) return "—";
  if (format === "decimal") return Number(value).toFixed(2);
  if (format === "percent") return `${Number(value).toFixed(1)}%`;

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function calcGrowth(current, previous) {
  if (!previous || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function formatGrowth(pct) {
  if (pct === null || pct === undefined) return null;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export function formatFYE(fye) {
  if (!fye || fye.length !== 4) return fye ?? "—";
  const month = parseInt(fye.slice(0, 2));
  const day = parseInt(fye.slice(2));
  return new Date(2000, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}
