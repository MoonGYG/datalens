"use client";

import { useState } from "react";

interface DataPreviewProps {
  data: Record<string, unknown>[];
  columns: string[];
  fileName: string;
}

export default function DataPreview({ data, columns, fileName }: DataPreviewProps) {
  const [showAll, setShowAll] = useState(false);
  const displayRows = showAll ? data : data.slice(0, 10);

  const getStats = () => {
    const numericCols = columns.filter((col) =>
      data.every((row) => !isNaN(Number(row[col])) && row[col] !== "" && row[col] !== null)
    );
    return {
      totalRows: data.length,
      totalCols: columns.length,
      numericCols: numericCols.length,
      textCols: columns.length - numericCols.length,
    };
  };

  const stats = getStats();

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--cyan-primary)] to-[var(--cyan-dark)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">{fileName}</h3>
            <p className="text-xs text-[var(--text-muted)]">
              {stats.totalRows.toLocaleString()} rows × {stats.totalCols} columns
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-lg bg-[var(--purple-primary)]/15 text-[var(--purple-light)] text-xs font-medium">
            {stats.numericCols} numeric
          </span>
          <span className="px-3 py-1 rounded-lg bg-[var(--cyan-primary)]/15 text-[var(--cyan-light)] text-xs font-medium">
            {stats.textCols} text
          </span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Rows", value: stats.totalRows.toLocaleString(), color: "purple" },
          { label: "Columns", value: stats.totalCols.toString(), color: "cyan" },
          { label: "Numeric", value: stats.numericCols.toString(), color: "purple" },
          { label: "Text", value: stats.textCols.toString(), color: "cyan" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-3 rounded-xl ${
              stat.color === "purple"
                ? "bg-[var(--purple-primary)]/10 border border-[var(--purple-primary)]/20"
                : "bg-[var(--cyan-primary)]/10 border border-[var(--cyan-primary)]/20"
            }`}
          >
            <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
            <p className={`text-lg font-bold ${
              stat.color === "purple" ? "text-[var(--purple-light)]" : "text-[var(--cyan-light)]"
            }`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Data table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
        <table className="data-table w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)]">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, idx) => (
              <tr key={idx} className="border-b border-[var(--border-color)]/50 transition-colors">
                <td className="px-4 py-2.5 text-[var(--text-muted)] font-mono text-xs">
                  {idx + 1}
                </td>
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2.5 text-[var(--text-secondary)] max-w-[200px] truncate">
                    {String(row[col] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show more */}
      {data.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--purple-primary)]/50 transition-all text-sm font-medium"
        >
          {showAll ? "Show Less" : `Show All ${data.length.toLocaleString()} Rows`}
        </button>
      )}
    </div>
  );
}
