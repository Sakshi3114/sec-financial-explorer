export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-ink-dim/60 font-mono">
          Data sourced from{" "}
          <a
            href="https://data.sec.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand/70 hover:text-brand transition-colors"
          >
            SEC EDGAR
          </a>{" "}
          · Free public API · No auth required
        </p>
        <p className="text-xs text-ink-dim/40 font-mono">
          SEC Financial Explorer · React + Vite + Tailwind
        </p>
      </div>
    </footer>
  );
}
