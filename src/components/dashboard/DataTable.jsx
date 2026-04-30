import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { METRIC_DEFS } from "../../constants";
import { formatValue, calcGrowth, formatGrowth } from "../../utils/formatters";

export default function DataTable() {
  const { metrics, activeMetric } = useApp();

  const def = METRIC_DEFS[activeMetric];
  const data = metrics[activeMetric];

  if (!def || !data?.series?.length) {
    return (
      <div className="card p-8 text-center">
        <p className="text-ink-dim text-sm">No table data available.</p>
      </div>
    );
  }

  // Most-recent first
  const rows = [...data.series].reverse();

  return (
    <div className="card overflow-hidden animate-fade-in">
      {/* Table header */}
      <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-3">
        <span className="text-xl leading-none">{def.icon}</span>
        <div>
          <h3 className="font-display font-bold text-white">{def.label}</h3>
          <p className="text-[11px] text-ink-dim font-mono mt-0.5">
            Annual history · 10-K filings
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07]">
              {["Fiscal Year", "Value", "YoY Change", "Filing"].map((col) => (
                <th
                  key={col}
                  className={`label px-5 py-3 ${
                    col === "Fiscal Year" ? "text-left" : "text-right"
                  } ${col === "Filing" ? "hidden sm:table-cell" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/4">
            {rows.map((row, i) => {
              const prev = rows[i + 1];
              const pct = prev ? calcGrowth(row.value, prev.value) : null;
              const growthStr = formatGrowth(pct);
              const isLatest = i === 0;
              const positive = pct !== null && pct >= 0;

              return (
                <tr
                  key={row.date}
                  className={`transition-colors ${
                    isLatest ? "bg-brand/4" : "hover:bg-white/2"
                  }`}
                >
                  {/* Year */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {isLatest && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                      )}
                      <span
                        className={`font-mono font-semibold ${
                          isLatest ? "text-brand" : "text-ink"
                        }`}
                      >
                        {row.date.slice(0, 4)}
                      </span>
                      <span className="hidden sm:inline text-[10px] text-ink-dim/50 font-mono">
                        {row.date}
                      </span>
                    </div>
                  </td>

                  {/* Value */}
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`font-mono font-semibold ${
                        isLatest ? "text-white" : "text-ink"
                      }`}
                    >
                      {formatValue(row.value, def.format)}
                    </span>
                  </td>

                  {/* Growth */}
                  <td className="px-5 py-3.5 text-right">
                    {growthStr ? (
                      <span
                        className={`inline-flex items-center justify-end gap-0.5 font-mono text-xs px-2 py-0.5 rounded
                          ${
                            positive
                              ? "text-bull bg-bull/10"
                              : "text-bear bg-bear/10"
                          }`}
                      >
                        {pct === 0 ? (
                          <Minus className="w-3 h-3" />
                        ) : positive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {growthStr}
                      </span>
                    ) : (
                      <span className="text-ink-dim/40 text-xs">—</span>
                    )}
                  </td>

                  {/* Filing form */}
                  <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                    <span className="badge-muted text-[10px]">{row.form}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[0.07] flex items-center justify-between">
        <p className="text-[10px] text-ink-dim/50 font-mono">
          Source: SEC EDGAR XBRL · USD
        </p>
        <p className="text-[10px] text-ink-dim/50 font-mono">
          {rows.length} year{rows.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
