"use client";

import { FaRobot, FaBell, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold">
          Welcome 👋
        </h2>

        <p className="text-sm text-gray-400">
          {today}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        <div className="hidden md:flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full">
          <FaRobot className="text-blue-400" />
          <span className="text-sm">
            AI Productivity Hub
          </span>
        </div>

        <button className="text-gray-300 hover:text-white transition">
          <FaBell size={20} />
        </button>

        <button className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-full hover:bg-slate-700 transition">
          <FaUserCircle size={26} />
          <span className="hidden sm:block">
            User
          </span>
        </button>

      </div>
    </header>
  );
}