import { useApp } from "../../context/AppContext";
import MetricCard from "./MetricCard";
import { METRIC_DEFS } from "../../constants";

export default function MetricsGrid() {
  const { metrics, activeMetric, setActiveMetric } = useApp();

  const available = Object.keys(METRIC_DEFS).filter((k) => metrics[k]?.latest);

  if (available.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-ink-dim text-sm">
          No financial data available for this company.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {available.map((key, i) => (
        <div
          key={key}
          className="animate-fade-up"
          style={{ animationDelay: `${i * 55}ms` }}
        >
          <MetricCard
            metricKey={key}
            data={metrics[key]}
            isActive={activeMetric === key}
            onClick={setActiveMetric}
          />
        </div>
      ))}
    </div>
  );
}
