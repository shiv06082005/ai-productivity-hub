"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  FaRobot,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const user = session?.user;

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 relative">
      
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

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-full hover:bg-slate-700 transition"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-7 h-7 rounded-full"
              />
            ) : (
              <FaUserCircle size={26} />
            )}

            <span className="hidden sm:block">
              {user?.name || "User"}
            </span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 z-50">
              
              <div className="border-b border-slate-700 pb-3 mb-3">
                <p className="font-semibold text-white">
                  {user?.name || "User"}
                </p>

                <p className="text-xs text-gray-400 mt-1 truncate">
                  {user?.email || "GitHub User"}
                </p>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center gap-3 text-red-400 hover:bg-slate-700 px-3 py-2 rounded-lg transition"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}