"use client";

import { useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";

interface HistoryEntry {
  url: string;
  mediaType: "movie" | "series";
  season?: number;
  episode?: number;
  timestamp?: string;
}

type MediaTypeFilter = "all" | "movie" | "series";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedType, setSelectedType] = useState<MediaTypeFilter>("all");
  const [copySuccess, setCopySuccess] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("watchHistory");
    if (stored) {
      const parsed: HistoryEntry[] = JSON.parse(stored).map((entry: HistoryEntry) => ({
        ...entry,
        timestamp: typeof entry.timestamp === "number"
          ? entry.timestamp
          : Number(entry.timestamp) || Date.now(),
      }));
      setHistory(parsed);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("watchHistory");
    setHistory([]);
  };

  const filteredHistory =
    selectedType === "all"
      ? history
      : history.filter((item) => item.mediaType === selectedType);

  return (
    <main className="max-w-3xl mx-auto p-6 text-white min-h-screen">
      <div className="flex gap-4 mb-6">
        {(["all", "movie", "series"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded border transition-all duration-300 ease-in-out cursor-pointer ${
              selectedType === type
                ? "bg-white text-black hover:bg-[#f1f1f1] border-white font-black"
                : "bg-transparent text-white hover:bg-[#222e] border-[#111]"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {filteredHistory.length === 0 ? (
        <p className="text-[#888] text-center mt-10">No history available.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {filteredHistory.map((entry, idx) => (
              <li
                key={idx}
                onClick={() => {
                  navigator.clipboard.writeText(entry.url).then(() => {
                    setCopySuccess("URL copied!");
                    setShowToast(true);
                    setTimeout(() => {
                      setShowToast(false);
                      setTimeout(() => setCopySuccess(""), 300);
                    }, 2000);
                  });
                }}
                className="p-4 border border-[#333] rounded hover:bg-[#1a1a1a] transition cursor-pointer"
              >
                <div className="flex flex-col gap-1">
                  <p className="break-all">{entry.url}</p>
                  {entry.mediaType === "series" && (
                    <p className="text-sm text-[#888]">
                      S{entry.season} - E{entry.episode}
                    </p>
                  )}
                  {entry.timestamp && (
                    <p className="text-xs text-[#555] text-right">
                      {entry.timestamp
                        ? getRelativeTime(Number(entry.timestamp))
                        : null}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowConfirm(true)}
              className="cursor-pointer px-4 py-2 flex items-center gap-2 bg-red-500 hover:bg-red-400 transition rounded text-white"
            >
              Clear History
            </button>
          </div>
        </>
      )}

      {copySuccess && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 z-[100] transition-all duration-300 ${
            showToast
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <MdCheckCircle className="text-xl" />
          <span>{copySuccess}</span>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center">
          <div className="bg-[#111] border border-[#333] rounded-lg p-6 max-w-sm w-full shadow-lg text-white text-center">
            <h2 className="text-lg font-semibold mb-4">Clear watch history?</h2>
            <p className="text-sm text-[#aaa] mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer px-4 py-2 bg-white text-black hover:bg-[#f1f1f1] transition rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setShowConfirm(false);
                }}
                className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-400 transition rounded text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const getRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, value] of units) {
    if (Math.abs(diff) >= value || unit === "second") {
      return rtf.format(-Math.floor(diff / value), unit);
    }
  }
};
