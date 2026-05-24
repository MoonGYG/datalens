"use client";

import { useState, useMemo } from "react";
import FileUpload from "@/components/FileUpload";
import DataPreview from "@/components/DataPreview";
import ChatInterface from "@/components/ChatInterface";
import ChartVisualization from "@/components/ChartVisualization";

export default function Home() {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [columns, setColumns] = useState<string[]>([]);

  const handleDataLoaded = (
    newData: Record<string, unknown>[],
    newFileName: string,
    newColumns: string[]
  ) => {
    setData(newData);
    setFileName(newFileName);
    setColumns(newColumns);
  };

  const dataPreview = useMemo(() => {
    if (data.length === 0) return "";
    const preview = data.slice(0, 5);
    return `File: ${fileName}\nColumns: ${columns.join(", ")}\nTotal rows: ${data.length}\n\nSample data:\n${preview
      .map((row, i) => `Row ${i + 1}: ${JSON.stringify(row)}`)
      .join("\n")}`;
  }, [data, fileName, columns]);

  const hasData = data.length > 0;

  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--purple-primary)]/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--cyan-primary)]/5 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--border-color)]/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--purple-primary)] to-[var(--cyan-primary)] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">
                <span className="gradient-text">DataLens</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)]">AI-Powered Data Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-[var(--cyan-primary)]/10 text-[var(--cyan-light)] text-xs font-medium border border-[var(--cyan-primary)]/20">
              Crafted with MiMo v2.5 Pro
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {!hasData ? (
          /* Upload state */
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">Analyze Your Data</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-xl">
                Upload CSV or JSON files and get instant AI-powered insights, statistics, and
                visualizations.
              </p>
            </div>
            <div className="w-full max-w-2xl">
              <FileUpload onDataLoaded={handleDataLoaded} />
            </div>
            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mt-8 max-w-3xl">
              {[
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--purple-light)" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  ),
                  title: "Smart Analysis",
                  desc: "Ask questions in natural language and get instant insights",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-light)" strokeWidth="2">
                      <path d="M3 3v18h18" />
                      <path d="M18 17V9" />
                      <path d="M13 17V5" />
                      <path d="M8 17v-3" />
                    </svg>
                  ),
                  title: "Auto Charts",
                  desc: "Generate beautiful visualizations from your data automatically",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                    </svg>
                  ),
                  title: "AI Insights",
                  desc: "Discover patterns, outliers, and trends with MiMo AI",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="glass-card p-5 text-center hover:scale-105 transition-transform"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Data loaded state */
          <div className="space-y-6">
            {/* Stats bar */}
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setData([]);
                    setFileName("");
                    setColumns([]);
                  }}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--purple-primary)]/50 transition-all"
                >
                  ← New File
                </button>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">{fileName}</h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    {data.length.toLocaleString()} rows · {columns.length} columns
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse-glow" />
                <span className="text-xs text-[var(--text-muted)]">Ready for analysis</span>
              </div>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Chat */}
              <ChatInterface dataPreview={dataPreview} hasData={hasData} />

              {/* Right: Chart */}
              <ChartVisualization data={data} columns={columns} />
            </div>

            {/* Data preview */}
            <DataPreview data={data} columns={columns} fileName={fileName} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border-color)]/50 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">
            © 2026 DataLens. Crafted with MiMo v2.5 Pro.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            v1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
}
