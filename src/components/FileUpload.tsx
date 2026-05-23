"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";

interface FileUploadProps {
  onDataLoaded: (data: Record<string, unknown>[], fileName: string, columns: string[]) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setIsLoading(true);
      setError(null);

      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              setError("Error parsing CSV: " + results.errors[0].message);
              setIsLoading(false);
              return;
            }
            const data = results.data as Record<string, unknown>[];
            const columns = results.meta.fields || [];
            onDataLoaded(data, file.name, columns);
            setIsLoading(false);
          },
          error: (err) => {
            setError("Failed to parse CSV: " + err.message);
            setIsLoading(false);
          },
        });
      } else if (ext === "json") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            const data = Array.isArray(json) ? json : [json];
            const columns = data.length > 0 ? Object.keys(data[0]) : [];
            onDataLoaded(data, file.name, columns);
            setIsLoading(false);
          } catch {
            setError("Invalid JSON file format");
            setIsLoading(false);
          }
        };
        reader.onerror = () => {
          setError("Failed to read file");
          setIsLoading(false);
        };
        reader.readAsText(file);
      } else {
        setError("Unsupported file type. Please upload CSV or JSON.");
        setIsLoading(false);
      }
    },
    [onDataLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full">
      <div
        className={`upload-zone rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging ? "dragover" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv,.json"
          onChange={handleFileInput}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="spinner" />
            <p className="text-[var(--text-secondary)]">Processing file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--purple-primary)] to-[var(--cyan-primary)] flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--text-primary)]">
                Drop your data file here
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Supports CSV and JSON files
              </p>
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-[var(--purple-primary)] hover:bg-[var(--purple-dark)] text-white font-medium transition-colors">
              Browse Files
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
