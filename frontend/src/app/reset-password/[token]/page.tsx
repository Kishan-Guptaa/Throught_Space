"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Lock, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { token } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    
    setIsLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setIsSuccess(true);
      toast.success("Password reset successful!");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reset password. Link might be expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Reset Password</h1>
          <p className="text-gray-500 font-medium text-sm">
            Enter your new password below to regain access to your account.
          </p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center py-8 space-y-6">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-gray-500 font-bold text-center">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-12 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-12 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white dark:bg-white dark:text-black rounded-2xl py-4 font-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-black/10"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
