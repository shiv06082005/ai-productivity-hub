"use client";

import { signIn } from "next-auth/react";
import { FaGithub, FaRocket } from "react-icons/fa";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <FaRocket className="text-white text-3xl" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-2">
            Sign in to continue to AI Productivity Hub
          </p>
        </div>

        {/* GitHub Login */}
        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-xl transition"
        >
          <FaGithub className="text-xl" />
          Continue with GitHub
        </button>

        <p className="text-center text-xs text-gray-500 mt-8">
          AI Productivity Hub • Powered by AI
        </p>

      </div>
    </main>
  );
}