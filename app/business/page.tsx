"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  FaLightbulb,
  FaWallet,
  FaUsers,
  FaPaperPlane,
  FaCopy,
  FaTrash,
} from "react-icons/fa";

type HistoryItem = {
  id: number;
  type: string;
  title: string;
  content: string;
  date: string;
};

export default function BusinessIdea() {
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [audience, setAudience] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function saveToHistory(idea: string) {
    try {
      const oldHistory = localStorage.getItem("ai-history");

      const history: HistoryItem[] = oldHistory
        ? JSON.parse(oldHistory)
        : [];

      const newItem: HistoryItem = {
        id: Date.now(),
        type: "Business Idea Generator",
        title: `${category.trim()} Business Idea`,
        content: idea,
        date: new Date().toLocaleString(),
      };

      localStorage.setItem(
        "ai-history",
        JSON.stringify([newItem, ...history])
      );
    } catch (error) {
      console.error("History save error:", error);
    }
  }

  async function generateIdea() {
    if (
      !category.trim() ||
      !budget.trim() ||
      !audience.trim()
    ) {
      setResult(
        "Please fill in Business Category, Budget, and Target Audience."
      );
      return;
    }

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          budget,
          audience,
        }),
      });

      const data = await res.json();

      if (data.success && data.idea) {
        setResult(data.idea);
        saveToHistory(data.idea);
      } else {
        setResult(
          `Error: ${
            data.error ||
            "Something went wrong. Please try again."
          }`
        );
      }
    } catch (error) {
      console.error("Business Generator Error:", error);

      setResult(
        "Server error. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  }

  function clearResult() {
    setResult("");
    setCopied(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-4xl mx-auto py-10 md:py-12 px-4 md:px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            💡 Business Idea Generator
          </h1>

          <p className="text-gray-400">
            Generate realistic startup ideas and business plans using AI.
          </p>
        </div>

        {/* Business Category */}
        <div className="relative mb-5">
          <FaLightbulb className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Business Category (Example: Technology)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Budget */}
        <div className="relative mb-5">
          <FaWallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Budget (Example: ₹50,000)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        {/* Target Audience */}
        <div className="relative mb-6">
          <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Target Audience (Example: College Students)"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateIdea}
          disabled={
            loading ||
            !category.trim() ||
            !budget.trim() ||
            !audience.trim()
          }
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
        >
          <FaPaperPlane />

          {loading
            ? "Generating Business Idea..."
            : "Generate Business Idea"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">

            {/* Result Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800 px-5 md:px-6 py-4 border-b border-slate-700">

              <h2 className="text-xl md:text-2xl font-bold text-blue-400">
                💡 AI Generated Business Plan
              </h2>

              <div className="flex gap-3">

                <button
                  onClick={copyResult}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                >
                  <FaCopy />
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={clearResult}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  <FaTrash />
                  Clear
                </button>

              </div>
            </div>

            {/* AI Output */}
            <div className="prose prose-invert prose-headings:text-white prose-p:text-gray-300 max-w-none p-5 md:p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}