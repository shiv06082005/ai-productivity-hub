"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  FaEnvelope,
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

export default function EmailAssistant() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  function saveToHistory(generatedEmail: string) {
    try {
      const oldHistory = localStorage.getItem("ai-history");

      const history: HistoryItem[] = oldHistory
        ? JSON.parse(oldHistory)
        : [];

      const newItem: HistoryItem = {
        id: Date.now(),
        type: "Email Assistant",
        title: prompt.slice(0, 50) || "AI Generated Email",
        content: generatedEmail,
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

  async function generateEmail() {
    if (!prompt.trim()) {
      setEmail("Please describe the email you want to generate.");
      return;
    }

    setLoading(true);
    setEmail("");
    setCopied(false);

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.success && data.email) {
        setEmail(data.email);
        saveToHistory(data.email);
      } else {
        setEmail(
          `Error: ${data.error || "Something went wrong. Please try again."}`
        );
      }
    } catch (error) {
      console.error("Email Assistant Error:", error);
      setEmail("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyEmail() {
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  }

  function clearEmail() {
    setEmail("");
    setCopied(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-4xl mx-auto py-12 px-6">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
          ✉️ AI Email Assistant
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Generate professional emails with AI.
        </p>

        {/* Email Prompt */}
        <div className="relative mb-6">
          <FaEnvelope className="absolute left-4 top-5 text-gray-400" />

          <textarea
            rows={7}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Write a professional internship request email to a company."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateEmail}
          disabled={loading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
        >
          <FaPaperPlane />

          {loading
            ? "Generating Email..."
            : "Generate Email"}
        </button>

        {/* Result */}
        {email && (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">

            {/* Result Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800 px-6 py-4 border-b border-slate-700">

              <h2 className="text-2xl font-bold text-blue-400">
                ✉️ Generated Email
              </h2>

              <div className="flex gap-3">

                <button
                  onClick={copyEmail}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                >
                  <FaCopy />
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={clearEmail}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  <FaTrash />
                  Clear
                </button>

              </div>
            </div>

            {/* AI Output */}
            <div className="prose prose-invert max-w-none p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {email}
              </ReactMarkdown>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}