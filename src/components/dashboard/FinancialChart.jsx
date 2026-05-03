import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { METRIC_DEFS } from "../../constants";
import { formatValue } from "../../utils/formatters";

function ChartTooltip({ active, payload, label, format, color }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="card-sm px-4 py-3 border border-white/15 shadow-2xl shadow-black/60 min-w-35">
      <p className="font-mono text-[11px] text-ink-dim mb-1">FY {label}</p>
      <p className="font-display font-bold text-lg" style={{ color }}>
        {formatValue(val, format)}
      </p>
      {payload[0]?.payload?.form && (
        <p className="font-mono text-[10px] text-ink-dim/50 mt-0.5">
          {payload[0].payload.form}
        </p>
      )}
    </div>
  );
}

function Toggle({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
        active
          ? "bg-brand/15 text-brand border border-brand/30"
          : "text-ink-dim hover:text-ink border border-transparent"
      }`}
    >
      {label}
    </button>
  );
}

export default function FinancialChart() {
  const { metrics, activeMetric } = useApp();
  const [type, setType] = useState("area");

  const def = METRIC_DEFS[activeMetric];
  const data = metrics[activeMetric];

  if (!def || !data?.series?.length) {
    return (
      <div className="card p-8 text-center">
        <p className="text-ink-dim text-sm">No chart data available.</p>
      </div>
    );
  }

  const chartData = data.series.map((d) => ({
    year: d.date.slice(0, 4),
    value: d.value,
    form: d.form,
  }));

  const hasNeg = chartData.some((d) => d.value < 0);
  const color = def.color;
  const format = def.format;
  const gradId = `grad-${activeMetric}`;

  const axisProps = {
    tick: { fill: "#7A90B0", fontSize: 11, fontFamily: "JetBrains Mono" },
    axisLine: { stroke: "rgba(255,255,255,0.07)" },
    tickLine: false,
  };

  const values = chartData.map((d) => d.value);
  const peak = Math.max(...values);
  const trough = Math.min(...values);

  return (
    <div className="card p-5 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-display font-bold text-white text-lg">
            {def.label}
          </h3>
          <p className="text-xs text-ink-dim font-mono mt-0.5">
            Annual (10-K) · {chartData.length} year
            {chartData.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-surface-2 rounded-lg p-1 self-start sm:self-auto">
          <Toggle
            label="Area"
            active={type === "area"}
            onClick={() => setType("area")}
          />
          <Toggle
            label="Bar"
            active={type === "bar"}
            onClick={() => setType("bar")}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart
              data={chartData}
              margin={{ top: 6, right: 4, bottom: 4, left: 4 }}
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis
                tickFormatter={(v) => formatValue(v, format)}
                width={68}
                {...axisProps}
                axisLine={false}
              />
              <Tooltip
                content={<ChartTooltip format={format} color={color} />}
              />
              {hasNeg && (
                <ReferenceLine
                  y={0}
                  stroke="rgba(255,255,255,0.18)"
                  strokeDasharray="4 4"
                />
              )}
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#${gradId})`}
                dot={{ fill: color, r: 4, strokeWidth: 0 }}
                activeDot={{
                  fill: color,
                  r: 6,
                  stroke: "#0F1117",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 6, right: 4, bottom: 4, left: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis
                tickFormatter={(v) => formatValue(v, format)}
                width={68}
                {...axisProps}
                axisLine={false}
              />
              <Tooltip
                content={<ChartTooltip format={format} color={color} />}
              />
              {hasNeg && (
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.25)" />
              )}
              <Bar
                dataKey="value"
                fill={color}
                fillOpacity={0.82}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer summary */}
      <div className="mt-5 pt-4 divider grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Earliest", val: values[0] },
          { label: "Latest", val: values[values.length - 1] },
          { label: "Peak", val: peak },
        ].map(({ label, val }) => (
          <div key={label}>
            <p className="label mb-1">{label}</p>
            <p className="font-mono text-sm font-medium text-white">
              {formatValue(val, format)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
