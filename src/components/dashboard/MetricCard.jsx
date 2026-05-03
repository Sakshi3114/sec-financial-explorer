import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { METRIC_DEFS } from "../../constants";
import { formatValue, formatGrowth } from "../../utils/formatters";

export default function MetricCard({ metricKey, data, isActive, onClick }) {
  const def = METRIC_DEFS[metricKey];
  if (!def || !data?.latest) return null;

  const { latest, growth } = data;
  const positive = growth !== null && growth >= 0;
  const growthStr = formatGrowth(growth);

  return (
    <button
      onClick={() => onClick(metricKey)}
      className={`card-sm p-4 text-left w-full transition-all duration-200 group
        ${
          isActive
            ? "border-brand/40 bg-brand/5 ring-1 ring-brand/20"
            : "hover:border-white/15 hover:bg-white/4"
        }`}
    >
      {/* Icon + growth pill */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-lg leading-none">{def.icon}</span>

        {growthStr && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border
              ${
                positive
                  ? "text-bull bg-bull/10 border-bull/20"
                  : "text-bear bg-bear/10 border-bear/20"
              }`}
          >
            {positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : growth === 0 ? (
              <Minus className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {growthStr}
          </span>
        )}
      </div>

      {/* Value */}
      <p
        className="font-display font-bold text-xl text-white mb-0.5 transition-colors"
        style={{ color: isActive ? def.color : undefined }}
      >
        {formatValue(latest.value, def.format)}
      </p>

      {/* Label */}
      <p className="label">{def.label}</p>
      {latest.date && (
        <p className="text-[10px] font-mono text-ink-dim/50 mt-0.5">
          FY {latest.date.slice(0, 4)}
        </p>
      )}

      {/* Active underline */}
      {isActive && (
        <div
          className="mt-3 h-0.5 rounded-full"
          style={{
            background: `linear-gradient(to right, ${def.color}, transparent)`,
          }}
        />
      )}
    </button>
  );
}
