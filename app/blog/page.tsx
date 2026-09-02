"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  FaPenNib,
  FaPaperPlane,
  FaCopy,
  FaTrash,
} from "react-icons/fa";

export default function BlogWriter() {
  const [topic, setTopic] = useState("");
  const [blog, setBlog] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateBlog() {
    if (!topic.trim()) {
      setBlog("Please enter a topic for your blog.");
      return;
    }

    setLoading(true);
    setBlog("");
    setCopied(false);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.blog) {
        setBlog(data.blog);
      } else {
        setBlog(
          `Error: ${
            data.error || "Something went wrong. Please try again."
          }`
        );
      }
    } catch (error) {
      console.error("Blog generation error:", error);
      setBlog("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyBlog() {
    if (!blog) return;

    try {
      await navigator.clipboard.writeText(blog);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  }

  function clearBlog() {
    setBlog("");
    setCopied(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-4xl mx-auto py-12 px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            📝 AI Blog Writer
          </h1>

          <p className="text-gray-400">
            Generate professional and engaging blog articles with AI.
          </p>
        </div>

        {/* Topic Input */}
        <div className="relative mb-6">
          <FaPenNib className="absolute left-4 top-5 text-gray-400" />

          <textarea
            rows={7}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: The Future of Artificial Intelligence"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateBlog}
          disabled={loading || !topic.trim()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
        >
          <FaPaperPlane />

          {loading
            ? "Generating Blog..."
            : "Generate Blog"}
        </button>

        {/* Result */}
        {blog && (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800 px-6 py-4 border-b border-slate-700">

              <h2 className="text-2xl font-bold text-blue-400">
                📝 Generated Blog
              </h2>

              <div className="flex gap-3">

                <button
                  onClick={copyBlog}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                >
                  <FaCopy />

                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={clearBlog}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  <FaTrash />
                  Clear
                </button>

              </div>
            </div>

            {/* Blog Output */}
            <div className="prose prose-invert max-w-none p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog}
              </ReactMarkdown>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}