import { Link, useLocation } from "react-router-dom";
import { BarChart2, ExternalLink } from "lucide-react";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center border-b border-white/[0.07] bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-brand/15 border border-brand/25 flex items-center justify-center transition-colors group-hover:bg-brand/25">
            <BarChart2 className="w-4 h-4 text-brand" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            SEC<span className="text-brand">Explorer</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/dashboard", label: "Dashboard" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? "bg-white/10 text-white"
                  : "text-ink-dim hover:text-ink hover:bg-white/5"
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://www.sec.gov/developer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-ink-dim hover:text-ink hover:bg-white/5 transition-colors"
          >
            SEC EDGAR <ExternalLink className="w-3 h-3" />
          </a>
        </nav>

        {/* Live badge */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse-dot" />
          <span className="hidden sm:block text-xs font-mono text-ink-dim">
            Live Data
          </span>
        </div>
      </div>
    </header>
  );
}
