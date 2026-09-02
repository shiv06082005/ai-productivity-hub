"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  FaBookOpen,
  FaCalendarAlt,
  FaClock,
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

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  function saveToHistory(plan: string) {
    try {
      const oldHistory = localStorage.getItem("ai-history");

      const history: HistoryItem[] = oldHistory
        ? JSON.parse(oldHistory)
        : [];

      const newItem: HistoryItem = {
        id: Date.now(),
        type: "Study Planner",
        title: `Study Plan - ${examDate}`,
        content: plan,
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

  async function generatePlan() {
    if (!subjects.trim() || !examDate || !hours) {
      setResult("Please fill in all required fields.");
      return;
    }

    const studyHours = Number(hours);

    if (studyHours < 1 || studyHours > 24) {
      setResult("Study hours must be between 1 and 24.");
      return;
    }

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const response = await fetch("/api/study-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjects,
          examDate,
          hours,
        }),
      });

      const data = await response.json();

      if (data.success && data.plan) {
        setResult(data.plan);
        saveToHistory(data.plan);
      } else {
        setResult(
          `Error: ${data.error || "Something went wrong. Please try again."}`
        );
      }
    } catch (error) {
      console.error("Study Planner Error:", error);
      setResult("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyPlan() {
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

  function clearPlan() {
    setResult("");
    setCopied(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Heading */}

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
          📚 AI Study Planner
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Create a personalized study schedule with AI.
        </p>

        {/* Subjects */}

        <div className="relative mb-5">
          <FaBookOpen className="absolute left-4 top-5 text-gray-400" />

          <textarea
            rows={5}
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            placeholder="Subjects (Example: Mathematics, Physics, Programming)"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Exam Date */}

        <div className="relative mb-5">
          <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Study Hours */}

        <div className="relative mb-6">
          <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="number"
            min="1"
            max="24"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Study Hours Per Day"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Generate Button */}

        <button
          onClick={generatePlan}
          disabled={
            loading ||
            !subjects.trim() ||
            !examDate ||
            !hours
          }
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
        >
          <FaPaperPlane />

          {loading
            ? "Generating Your Study Plan..."
            : "Generate Study Plan"}
        </button>

        {/* Result */}

        {result && (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
            {/* Result Header */}

            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800 px-6 py-4 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-blue-400">
                📚 Your Study Plan
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={copyPlan}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                >
                  <FaCopy />
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={clearPlan}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  <FaTrash />
                  Clear
                </button>
              </div>
            </div>

            {/* Markdown Output */}

            <div className="prose prose-invert max-w-none p-6">
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