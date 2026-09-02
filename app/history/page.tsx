"use client";

import { useEffect, useState } from "react";
import {
  FaHistory,
  FaTrash,
  FaCopy,
} from "react-icons/fa";

type HistoryItem = {
  id: number;
  type: string;
  title: string;
  content: string;
  date: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("ai-history");

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  function clearAllHistory() {
    localStorage.removeItem("ai-history");
    setHistory([]);
  }

  function deleteItem(id: number) {
    const updatedHistory = history.filter(
      (item) => item.id !== id
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      "ai-history",
      JSON.stringify(updatedHistory)
    );
  }

  async function copyItem(content: string) {
    await navigator.clipboard.writeText(content);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">

          <div>
            <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
              <FaHistory className="text-blue-400" />
              History
            </h1>

            <p className="text-gray-400 mt-3">
              View your previously generated AI content.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl transition"
            >
              <FaTrash />
              Clear All
            </button>
          )}

        </div>

        {history.length === 0 ? (
          <div className="border border-slate-700 bg-slate-900 rounded-2xl p-12 text-center">

            <FaHistory className="text-6xl text-gray-600 mx-auto mb-5" />

            <h2 className="text-2xl font-bold mb-2">
              No History Yet
            </h2>

            <p className="text-gray-400">
              Your generated resumes, blogs, emails,
              travel plans and other AI content will
              appear here.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden"
              >

                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800 px-6 py-4">

                  <div>
                    <span className="text-xs bg-blue-600 px-3 py-1 rounded-full">
                      {item.type}
                    </span>

                    <h2 className="text-xl font-bold mt-2">
                      {item.title}
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      {item.date}
                    </p>
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        copyItem(item.content)
                      }
                      className="bg-green-600 hover:bg-green-700 p-3 rounded-lg transition"
                      title="Copy"
                    >
                      <FaCopy />
                    </button>

                    <button
                      onClick={() =>
                        deleteItem(item.id)
                      }
                      className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>

                  </div>
                </div>

                <div className="p-6 text-gray-300 whitespace-pre-wrap max-h-60 overflow-hidden">
                  {item.content}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}