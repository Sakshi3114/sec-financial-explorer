import { AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";

export default function ErrorCard({ error, onRetry }) {
  return (
    <div className="card p-10 text-center border-bear/20 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-bear/10 border border-bear/20 flex items-center justify-center mx-auto mb-5">
        <AlertTriangle className="w-6 h-6 text-bear" />
      </div>
      <h3 className="font-display font-bold text-white text-lg mb-2">
        Failed to Load Data
      </h3>
      <p className="text-ink-dim text-sm max-w-md mx-auto leading-relaxed mb-7">
        {error || "An unexpected error occurred while fetching SEC EDGAR data."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button onClick={onRetry} className="btn-brand">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
        <a
          href="https://www.sec.gov/cgi-bin/browse-edgar"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          <ExternalLink className="w-4 h-4" /> Open SEC EDGAR
        </a>
      </div>
      <p className="text-xs text-ink-dim/50 mt-7 font-mono">
        SEC EDGAR may be temporarily unavailable or the company may not have
        XBRL filings.
      </p>
    </div>
  );
}
