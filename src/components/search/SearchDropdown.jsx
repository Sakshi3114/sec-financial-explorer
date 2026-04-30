import { ChevronRight, AlertCircle } from "lucide-react";

export default function SearchDropdown({
  results,
  loading,
  error,
  query,
  onSelect,
}) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 card-sm overflow-hidden shadow-2xl shadow-black/60 z-50 animate-slide-down">
      {/* Error */}
      {error && (
        <div className="px-4 py-3 flex items-center gap-2 text-sm text-bear/80">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Empty */}
      {!error && !loading && results.length === 0 && (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-ink-dim">
            No results for "<span className="text-ink">{query}</span>"
          </p>
          <p className="text-xs text-ink-dim/60 mt-1">
            Try a full company name or ticker symbol
          </p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <ul className="max-h-72 overflow-y-auto divide-y divide-white/[0.05]">
          {results.map((company) => (
            <li key={company.cik}>
              <button
                onClick={() => onSelect(company)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[0.05] transition-colors text-left group"
              >
                {/* Ticker chip */}
                <div className="flex-shrink-0 w-14 text-center">
                  <span className="badge-brand text-[11px] px-2 py-0.5 rounded font-mono font-semibold">
                    {company.ticker}
                  </span>
                </div>

                {/* Name + CIK */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate group-hover:text-white transition-colors">
                    {company.name}
                  </p>
                  <p className="text-[11px] text-ink-dim font-mono">
                    CIK: {company.cik}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-ink-dim group-hover:text-brand transition-colors flex-shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
