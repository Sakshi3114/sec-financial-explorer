/** Pad CIK to 10 digits */
export function padCIK(cik) {
  return String(cik).replace(/^0+/, "").padStart(10, "0");
}

/** Format a raw number to compact currency / decimal string */
export function formatValue(value, format = "currency") {
  if (value === null || value === undefined) return "—";
  if (format === "decimal") return Number(value).toFixed(2);
  if (format === "percent") return `${Number(value).toFixed(1)}%`;
  // currency
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

/** Calculate YoY growth % */
export function calcGrowth(current, previous) {
  if (!previous || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/** Format growth to string like +12.4% */
export function formatGrowth(pct) {
  if (pct === null || pct === undefined) return null;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

/** Format fiscal year end "0930" → "September 30" */
export function formatFYE(fye) {
  if (!fye || fye.length !== 4) return fye ?? "—";
  const month = parseInt(fye.slice(0, 2));
  const day = parseInt(fye.slice(2));
  return new Date(2000, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}
