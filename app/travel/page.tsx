"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWallet,
  FaUsers,
  FaPaperPlane,
  FaCopy,
  FaTrash,
} from "react-icons/fa";

export default function TravelPlanner() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateTrip() {
    if (
      !destination.trim() ||
      !days ||
      !budget.trim() ||
      !travelers.trim()
    ) {
      setResult("Please fill in all travel details.");
      return;
    }

    const numberOfDays = Number(days);

    if (numberOfDays < 1 || numberOfDays > 30) {
      setResult("Please enter a valid number of days between 1 and 30.");
      return;
    }

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const res = await fetch("/api/travel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          days,
          budget,
          travelers,
        }),
      });

      const data = await res.json();

      if (data.success && data.plan) {
        setResult(data.plan);
      } else {
        setResult(
          `Error: ${
            data.error || "Something went wrong while generating your travel plan."
          }`
        );
      }
    } catch (error) {
      console.error("Travel Planner Error:", error);
      setResult(
        "Server error. Please check your API configuration and try again."
      );
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

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            ✈️ AI Travel Planner
          </h1>

          <p className="text-gray-400">
            Create your perfect personalized travel itinerary with AI.
          </p>
        </div>

        {/* Form Container */}

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl">

          {/* Destination */}

          <div className="relative mb-5">
            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Destination (Example: Goa, India)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {/* Days */}

          <div className="relative mb-5">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="number"
              min="1"
              max="30"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Number of Days (Example: 5)"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>

          {/* Budget */}

          <div className="relative mb-5">
            <FaWallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Budget (Example: ₹30,000)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          {/* Travelers */}

          <div className="relative mb-6">
            <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Travelers / Travel Type (Example: 2 Friends)"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
            />
          </div>

          {/* Generate Button */}

          <button
            onClick={generateTrip}
            disabled={
              loading ||
              !destination.trim() ||
              !days ||
              !budget.trim() ||
              !travelers.trim()
            }
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
          >
            <FaPaperPlane />

            {loading
              ? "Planning Your Perfect Trip..."
              : "Generate Travel Plan"}
          </button>

        </div>

        {/* Result */}

        {result && (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">

            {/* Result Header */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800 px-6 py-4 border-b border-slate-700">

              <div>
                <h2 className="text-2xl font-bold text-blue-400">
                  ✈️ Your AI Travel Plan
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Personalized itinerary for {destination}
                </p>
              </div>

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

            {/* AI Output */}

            <div className="prose prose-invert prose-headings:text-blue-400 max-w-none p-6 md:p-8">

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