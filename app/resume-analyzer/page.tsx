"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  FaFileAlt,
  FaSearch,
  FaBriefcase,
  FaCopy,
  FaTrash,
  FaUpload,
  FaFilePdf,
} from "react-icons/fa";

export default function ResumeAnalyzerPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState("");
  const [fileName, setFileName] = useState("");

  async function handlePdfUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    setResult("");
    setFileName(file.name);

    try {
      // Import PDF.js
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

      // Configure PDF worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const arrayBuffer = await file.arrayBuffer();

      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
      });

      const pdf = await loadingTask.promise;

      let extractedText = "";

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => {
            if ("str" in item) {
              return item.str;
            }

            return "";
          })
          .join(" ");

        extractedText += pageText + "\n\n";
      }

      extractedText = extractedText.trim();

      if (!extractedText) {
        throw new Error("No readable text found in PDF");
      }

      setResume(extractedText);

      alert("PDF uploaded successfully! Resume text has been extracted.");
    } catch (error) {
      console.error("PDF Upload Error:", error);

      setFileName("");

      alert(
        "Unable to read this PDF. Please make sure it is a valid text-based PDF."
      );
    } finally {
      setUploading(false);

      // Allow same file to be uploaded again
      event.target.value = "";
    }
  }

  async function analyzeResume() {
    if (!resume.trim()) {
      alert("Please paste your resume or upload a PDF first.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/resume-analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.analysis);
      } else {
        setResult(
          `Error: ${
            data.error || "Something went wrong. Please try again."
          }`
        );
      }
    } catch (error) {
      console.error(error);
      setResult("Server Error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyAnalysis() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      alert("Analysis copied successfully!");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  function clearAll() {
    setResume("");
    setJobDescription("");
    setResult("");
    setFileName("");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-4xl mx-auto py-12 px-6">
        
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
          🔍 AI Resume Analyzer
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Upload or paste your resume and get AI-powered ATS improvement
          suggestions.
        </p>

        {/* PDF Upload */}
        <div className="mb-6">
          <label className="flex items-center gap-2 mb-3 font-semibold">
            <FaFilePdf className="text-red-400" />
            Upload Resume PDF
          </label>

          <label className="w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-700 bg-slate-800 hover:bg-slate-700 rounded-xl p-8 cursor-pointer transition">
            <FaUpload className="text-3xl text-blue-400" />

            <span className="font-medium text-gray-300">
              {uploading
                ? "Reading your PDF..."
                : "Click here to upload your Resume PDF"}
            </span>

            <span className="text-sm text-gray-500">
              Only PDF files are supported
            </span>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {fileName && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-3 text-green-400">
              <FaFilePdf />

              <span className="text-sm">
                PDF Selected: <strong>{fileName}</strong>
              </span>
            </div>
          )}
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-700" />

          <span className="text-gray-500 text-sm font-medium">
            OR
          </span>

          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {/* Resume Input */}
        <div className="mb-6">
          <label className="flex items-center gap-2 mb-3 font-semibold">
            <FaFileAlt className="text-blue-400" />
            Paste Your Resume
          </label>

          <textarea
            rows={12}
            value={resume}
            onChange={(e) => {
              setResume(e.target.value);
            }}
            placeholder="Paste your complete resume here or upload a PDF above..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label className="flex items-center gap-2 mb-3 font-semibold">
            <FaBriefcase className="text-blue-400" />
            Job Description (Optional)
          </label>

          <textarea
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for better job-match analysis..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Analyze Button */}
        <button
          type="button"
          onClick={analyzeResume}
          disabled={loading || uploading || !resume.trim()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
        >
          <FaSearch />

          {uploading
            ? "Reading PDF..."
            : loading
            ? "Analyzing Resume..."
            : "Analyze Resume"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
            
            {/* Result Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800 px-6 py-4 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-blue-400">
                📊 Resume Analysis
              </h2>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyAnalysis}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                >
                  <FaCopy />
                  Copy
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  <FaTrash />
                  Clear
                </button>
              </div>
            </div>

            {/* Analysis */}
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