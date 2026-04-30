import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import SearchBar from "../components/search/SearchBar";
import CompanyHeader from "../components/dashboard/CompanyHeader";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import FinancialChart from "../components/dashboard/FinancialChart";
import DataTable from "../components/dashboard/DataTable";
import TabNav from "../components/dashboard/TabNav";
import ErrorCard from "../components/ui/ErrorCard";
import EmptyState from "../components/ui/EmptyState";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { METRIC_DEFS } from "../constants";

function MetricChips({ available, active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {available.map((key) => {
        const def = METRIC_DEFS[key];
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              active === key
                ? "border-brand/50 text-brand bg-brand/10"
                : "border-white/[0.07] text-ink-dim hover:border-white/15 hover:text-ink"
            }`}
          >
            <span>{def.icon}</span>
            {def.label}
          </button>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const {
    company,
    loading,
    error,
    metrics,
    activeMetric,
    activeTab,
    setActiveMetric,
    loadCompany,
  } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!company && !loading && !error) navigate("/");
  }, [company, loading, error, navigate]);

  const available = Object.keys(METRIC_DEFS).filter((k) => metrics[k]?.latest);

  return (
    <div className="min-h-screen bg-surface">
      <div
        className="pointer-events-none fixed top-0 inset-x-0 h-80"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -10%,rgba(0,200,150,0.07) 0%,transparent 70%)",
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <div className="mb-6 max-w-xl">
          <SearchBar onSelect={(c) => loadCompany(c)} />
        </div>

        {loading && <DashboardSkeleton />}

        {!loading && error && (
          <ErrorCard
            error={error}
            onRetry={company ? () => loadCompany(company) : undefined}
          />
        )}

        {!loading && !error && !company && (
          <EmptyState
            icon="🔍"
            title="No company selected"
            description="Use the search bar above or go back to the home page to pick a company."
            action={
              <button onClick={() => navigate("/")} className="btn-brand">
                Back to Search
              </button>
            }
          />
        )}

        {!loading && !error && company && (
          <div className="space-y-6">
            <CompanyHeader />
            <TabNav />

            {activeTab === "overview" && (
              <div className="space-y-6 animate-fade-in">
                <MetricsGrid />
                {available.length > 0 && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="label">Chart metric</p>
                      <MetricChips
                        available={available}
                        active={activeMetric}
                        onSelect={setActiveMetric}
                      />
                    </div>
                    <FinancialChart />
                  </>
                )}
              </div>
            )}

            {activeTab === "charts" && (
              <div className="space-y-5 animate-fade-in">
                <MetricChips
                  available={available}
                  active={activeMetric}
                  onSelect={setActiveMetric}
                />
                <FinancialChart />
              </div>
            )}

            {activeTab === "table" && (
              <div className="space-y-4 animate-fade-in">
                <MetricChips
                  available={available}
                  active={activeMetric}
                  onSelect={setActiveMetric}
                />
                <DataTable />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
