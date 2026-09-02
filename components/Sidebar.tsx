"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FaHome,
  FaFileAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaComments,
  FaPenNib,
  FaLightbulb,
  FaUserTie,
  FaPlane,
  FaRocket,
  FaGithub,
  FaHistory,
} from "react-icons/fa";

const menu = [
  { name: "Dashboard", href: "/", icon: FaHome },
  { name: "Resume Builder", href: "/resume", icon: FaFileAlt },
  { name: "Study Planner", href: "/study-planner", icon: FaCalendarAlt },
  { name: "Email Assistant", href: "/email", icon: FaEnvelope },
  { name: "AI Chat", href: "/chat", icon: FaComments },
  { name: "Blog Writer", href: "/blog", icon: FaPenNib },
  { name: "Business Ideas", href: "/business", icon: FaLightbulb },
  { name: "Interview Prep", href: "/interview", icon: FaUserTie },
  { name: "Travel Planner", href: "/travel", icon: FaPlane },

  // History
  { name: "History", href: "/history", icon: FaHistory },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">

          <div className="bg-blue-600 p-3 rounded-xl">
            <FaRocket className="text-white text-xl" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              AI Productivity Hub
            </h1>

            <p className="text-xs text-gray-400">
              Your AI Workspace
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-5 space-y-2 overflow-y-auto">

        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="text-lg" />

              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}

      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">

        <div className="bg-slate-900 rounded-xl p-4">

          <p className="text-sm font-semibold text-white">
            🚀 AI Productivity Hub
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Built using Next.js + Groq AI
          </p>

          <button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-2 flex items-center justify-center gap-2"
          >
            <FaGithub />
            GitHub
          </button>

        </div>

      </div>

    </aside>
  );
}