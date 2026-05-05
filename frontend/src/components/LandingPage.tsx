"use client";

import Link from "next/link";
import { PenTool, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-[#111111] text-gray-900 dark:text-gray-100 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-100 dark:bg-gray-900 rounded-full blur-3xl opacity-50 -z-10" />

      {/* Header Logo */}
      <div className="absolute top-8 left-8">
        <span className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tighter flex items-center gap-1">
          Thought<span className="text-gray-400">Space</span>
          <PenTool className="w-5 h-5 text-gray-900 dark:text-gray-100 rotate-12" />
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl text-center space-y-8 z-10">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
          Write. <br />
          <span className="text-gray-400">Share.</span> <br />
          Inspire.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto font-medium">
          The premium platform for developers and designers to share their knowledge with the world. Clean, fast, and beautifully minimal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-gray-100 dark:bg-gray-100 dark:text-gray-900 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
          >
            Start Writing <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-gray-200 text-gray-900 dark:bg-[#1A1A1A] dark:text-gray-100 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Explore Blogs
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center w-full text-sm text-gray-400 font-medium">
        © {new Date().getFullYear()} ThoughtSpace. Crafted for creators.
      </div>
    </div>
  );
}
