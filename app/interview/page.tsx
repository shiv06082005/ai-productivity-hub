"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  FaBriefcase,
  FaUserGraduate,
  FaPaperPlane,
  FaCopy,
  FaTrash,
  FaCheck,
} from "react-icons/fa";

type HistoryItem = {
  id: number;
  type: string;
  title: string;
  content: string;
  date: string;
};

export default function InterviewPrep() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function saveToHistory(interview: string) {
    try {
      const oldHistory = localStorage.getItem("ai-history");

      const history: HistoryItem[] = oldHistory
        ? JSON.parse(oldHistory)
        : [];

      const newItem: HistoryItem = {
        id: Date.now(),
        type: "Interview Preparation",
        title: `${role} Interview Guide`,
        content: interview,
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

  async function generateInterview() {
    if (!role.trim() || !experience.trim()) {
      setResult(
        "Please enter both the Job Role and Experience Level."
      );
      return;
    }

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: role.trim(),
          experience: experience.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.interview) {
        setResult(data.interview);
        saveToHistory(data.interview);
      } else {
        setResult(
          `Error: ${
            data.error || "Something went wrong. Please try again."
          }`
        );
      }
    } catch (error) {
      console.error("Interview Error:", error);

      setResult(
        "Server error. Please check your API configuration and try again."
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
      <div className="max-w-4xl mx-auto py-12 px-6">

        {/* Heading */}

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
          🎤 AI Interview Preparation
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Prepare for your dream job with personalized AI interview questions.
        </p>

        {/* Job Role */}

        <div className="relative mb-5">
          <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Job Role (Example: Software Engineer)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        {/* Experience */}

        <div className="relative mb-6">
          <FaUserGraduate className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Experience Level (Example: Fresher / 2 Years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        {/* Generate Button */}

        <button
          onClick={generateInterview}
          disabled={
            loading ||
            !role.trim() ||
            !experience.trim()
          }
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
        >
          <FaPaperPlane />

          {loading
            ? "Generating Interview Guide..."
            : "Generate Interview Guide"}
        </button>

        {/* Result */}

        {result && (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">

            {/* Header */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800 px-6 py-4 border-b border-slate-700">

              <h2 className="text-xl md:text-2xl font-bold text-blue-400">
                🎤 Your Interview Preparation Guide
              </h2>

              <div className="flex gap-3">

                <button
                  onClick={copyResult}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                >
                  {copied ? <FaCheck /> : <FaCopy />}

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

            <div className="prose prose-invert max-w-none p-6 md:p-8 prose-headings:text-blue-400 prose-strong:text-white">
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