import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, BarChart2, Shield } from "lucide-react";
import SearchBar from "../components/search/SearchBar";
import { useApp } from "../context/AppContext";
import { POPULAR_COMPANIES } from "../constants";

function FeaturePill({ icon: Icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/8 bg-white/4 text-xs text-ink-dim">
      <Icon className="w-3.5 h-3.5 text-brand" />
      {text}
    </div>
  );
}

function CompanyPill({ company, onClick, delay }) {
  return (
    <button
      onClick={() => onClick(company)}
      className="card-sm p-3 text-center hover:border-brand/30 hover:bg-brand/5 transition-all duration-200 group animate-fade-up"
      style={{ animationDelay: delay }}
    >
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mx-auto mb-2 group-hover:bg-brand/15 transition-colors">
        <span className="font-display font-black text-sm text-ink-dim group-hover:text-brand transition-colors">
          {company.name.charAt(0)}
        </span>
      </div>
      <p className="font-mono text-[11px] font-semibold text-brand">
        {company.ticker}
      </p>
      <p className="text-[10px] text-ink-dim truncate leading-tight mt-0.5">
        {company.name}
      </p>
    </button>
  );
}

export default function HomePage() {
  const { loadCompany } = useApp();
  const navigate = useNavigate();

  async function handleSelect(company) {
    await loadCompany(company);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-105"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%,rgba(0,200,150,0.13) 0%,transparent 70%)",
          }}
        />
        <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-64 h-64 rounded-full bg-brand/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        <div className="flex justify-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-xs font-mono text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-dot" />
            Real-time SEC EDGAR Data · No API key required
          </div>
        </div>

        <div className="text-center mb-10">
          <h1
            className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-5 animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            Explore Financial
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg,#00C896 0%,#3D6BFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Intelligence
            </span>
          </h1>
          <p
            className="text-ink-dim text-base sm:text-lg max-w-xl mx-auto leading-relaxed animate-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            Search any publicly traded US company and instantly explore
            revenues, assets, liabilities, EPS and more — pulled live from
            official SEC EDGAR filings.
          </p>
        </div>

        <div
          className="animate-fade-up mb-3"
          style={{ animationDelay: "200ms" }}
        >
          <SearchBar
            onSelect={handleSelect}
            placeholder="Search by company name, ticker, or CIK…"
          />
        </div>
        <p className="text-center text-xs text-ink-dim/50 font-mono mb-14">
          Try "Apple", "MSFT", or enter a CIK number directly
        </p>

        <div
          className="flex flex-wrap justify-center gap-2.5 mb-14 animate-fade-up"
          style={{ animationDelay: "260ms" }}
        >
          <FeaturePill icon={Zap} text="Live EDGAR data" />
          <FeaturePill icon={BarChart2} text="Interactive charts" />
          <FeaturePill icon={Shield} text="Official SEC filings" />
          <FeaturePill icon={ArrowRight} text="8 key financial metrics" />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "310ms" }}>
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px flex-1 bg-white/[0.07]" />
            <p className="label">Popular Companies</p>
            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {POPULAR_COMPANIES.map((company, i) => (
              <CompanyPill
                key={company.cik}
                company={company}
                onClick={handleSelect}
                delay={`${350 + i * 35}ms`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
