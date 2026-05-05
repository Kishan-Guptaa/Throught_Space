"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setIsSent(true);
      toast.success("Reset link sent!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Forgot Password?</h1>
          <p className="text-gray-500 font-medium text-sm px-4">
            {isSent 
              ? "Check your email for the reset link we just sent you." 
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </p>
        </div>

        {isSent ? (
          <div className="flex flex-col items-center py-8 space-y-6">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <Link 
              href="/login"
              className="text-gray-900 dark:text-white font-black flex items-center gap-2 hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-5 h-5" /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-12 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-bold"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white dark:bg-white dark:text-black rounded-2xl py-4 font-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-black/10"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link 
                href="/login"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
