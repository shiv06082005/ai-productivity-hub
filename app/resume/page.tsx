"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";

import {
  FaUser,
  FaGraduationCap,
  FaTools,
  FaBriefcase,
  FaBullseye,
  FaPaperPlane,
  FaCopy,
  FaTrash,
  FaFilePdf,
} from "react-icons/fa";

type HistoryItem = {
  id: number;
  type: string;
  title: string;
  content: string;
  date: string;
};

export default function ResumePage() {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [objective, setObjective] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  function saveToHistory(resume: string) {
    try {
      const oldHistory = localStorage.getItem("ai-history");

      const history: HistoryItem[] = oldHistory
        ? JSON.parse(oldHistory)
        : [];

      const newItem: HistoryItem = {
        id: Date.now(),
        type: "Resume Builder",
        title: name.trim()
          ? `${name.trim()} - Resume`
          : "AI Generated Resume",
        content: resume,
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

  async function generateResume() {
    if (!name.trim() || !education.trim() || !skills.trim()) {
      setResult("Please fill in Name, Education, and Skills.");
      return;
    }

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          education,
          skills,
          experience,
          objective,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.resume) {
        setResult(data.resume);
        saveToHistory(data.resume);
      } else {
        setResult(
          `Error: ${
            data.error || "Something went wrong. Please try again."
          }`
        );
      }
    } catch (error) {
      console.error("Resume Error:", error);
      setResult("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResume() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  function clearResume() {
    setResult("");
    setCopied(false);
  }

  function downloadPDF() {
    if (!result) return;

    const pdf = new jsPDF();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    const cleanText = result
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/`/g, "");

    const lines = pdf.splitTextToSize(cleanText, 180);

    const pageHeight = pdf.internal.pageSize.getHeight();

    let y = 20;

    lines.forEach((line: string) => {
      if (y > pageHeight - 20) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(line, 15, y);
      y += 7;
    });

    const fileName = name.trim()
      ? `${name.trim().replace(/\s+/g, "_")}_Resume.pdf`
      : "AI_Resume.pdf";

    pdf.save(fileName);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-4xl mx-auto py-12 px-6">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
          📄 AI Resume Builder
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Generate a professional and ATS-friendly resume using AI.
        </p>

        {/* Name */}
        <div className="relative mb-5">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Education */}
        <div className="relative mb-5">
          <FaGraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="Education (Example: B.Tech in Computer Science)"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Skills */}
        <div className="relative mb-5">
          <FaTools className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills (Example: Python, Java, React, SQL)"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Experience */}
        <div className="relative mb-5">
          <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <textarea
            rows={4}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Experience / Internship (Optional)"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Objective */}
        <div className="relative mb-6">
          <FaBullseye className="absolute left-4 top-5 text-gray-400" />

          <textarea
            rows={5}
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Career Objective (Optional)"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={generateResume}
          disabled={
            loading ||
            !name.trim() ||
            !education.trim() ||
            !skills.trim()
          }
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
        >
          <FaPaperPlane />

          {loading
            ? "Generating Resume..."
            : "Generate Resume"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800 px-6 py-4 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-blue-400">
                📄 AI Generated Resume
              </h2>

              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={copyResume}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                >
                  <FaCopy />
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  type="button"
                  onClick={downloadPDF}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                  <FaFilePdf />
                  Download PDF
                </button>

                <button
                  type="button"
                  onClick={clearResume}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  <FaTrash />
                  Clear
                </button>

              </div>
            </div>

            {/* Resume Content */}
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