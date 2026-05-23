"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartVisualizationProps {
  data: Record<string, unknown>[];
  columns: string[];
}

const CHART_COLORS = [
  "#7c3aed",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

type ChartType = "bar" | "line" | "pie" | "scatter";

export default function ChartVisualization({ data, columns }: ChartVisualizationProps) {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [xAxis, setXAxis] = useState(columns[0] || "");
  const [yAxis, setYAxis] = useState("");

  const numericColumns = useMemo(
    () =>
      columns.filter((col) =>
        data.slice(0, 20).every((row) => {
          const val = row[col];
          return val !== "" && val !== null && val !== undefined && !isNaN(Number(val));
        })
      ),
    [columns, data]
  );

  const textColumns = useMemo(
    () => columns.filter((col) => !numericColumns.includes(col)),
    [columns, numericColumns]
  );

  useMemo(() => {
    if (numericColumns.length > 0 && !yAxis) {
      setYAxis(numericColumns[0]);
    }
  }, [numericColumns, yAxis]);

  const chartData = useMemo(() => {
    if (!xAxis || !yAxis) return [];
    return data.slice(0, 50).map((row, idx) => ({
      name: String(row[xAxis] || idx + 1),
      value: Number(row[yAxis]) || 0,
      ...numericColumns.reduce(
        (acc, col) => ({ ...acc, [col]: Number(row[col]) || 0 }),
        {}
      ),
    }));
  }, [data, xAxis, yAxis, numericColumns]);

  const COLORS = CHART_COLORS;

  if (numericColumns.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--warning)] to-[var(--error)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Visualization</h3>
            <p className="text-xs text-[var(--text-muted)]">No numeric columns detected</p>
          </div>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Upload data with numeric columns to generate charts and visualizations.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--purple-primary)] to-[var(--cyan-primary)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Visualization</h3>
            <p className="text-xs text-[var(--text-muted)]">
              {chartData.length} data points
            </p>
          </div>
        </div>

        {/* Chart type selector */}
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-secondary)]">
          {[
            { type: "bar" as ChartType, label: "Bar" },
            { type: "line" as ChartType, label: "Line" },
            { type: "pie" as ChartType, label: "Pie" },
            { type: "scatter" as ChartType, label: "Scatter" },
          ].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                chartType === type
                  ? "bg-[var(--purple-primary)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Axis selectors */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="text-xs text-[var(--text-muted)] mb-1.5 block">X Axis</label>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--purple-primary)]"
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Y Axis</label>
          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--purple-primary)]"
          >
            {numericColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                }}
              />
              <Bar dataKey="value" fill="var(--purple-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--cyan-primary)"
                strokeWidth={2}
                dot={{ fill: "var(--cyan-primary)", r: 3 }}
              />
            </LineChart>
          ) : chartType === "pie" ? (
            <PieChart>
              <Pie
                data={chartData.slice(0, 10)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={120}
                dataKey="value"
              >
                {chartData.slice(0, 10).map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                }}
              />
              <Legend />
            </PieChart>
          ) : (
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <YAxis dataKey="value" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                }}
              />
              <Scatter data={chartData} fill="var(--cyan-primary)" />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
