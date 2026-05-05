"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

import api from "@/lib/axios";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", { name, email, password });
      login(response.data.user);
      toast.success("Account created! Welcome to ThoughtSpace.");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#111111] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-100 dark:bg-gray-900/50 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gray-100 dark:bg-gray-900/50 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
             <span className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">
                Thought<span className="text-gray-400">Space</span>
             </span>
          </Link>
          <h2 className="mt-6 text-3xl font-black text-gray-900 dark:text-gray-100 font-serif">Join the Community</h2>
          <p className="mt-2 text-gray-500 font-medium">Create your space for thoughts and ideas.</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all text-gray-900 dark:text-gray-100 font-medium"
                  placeholder="Full name"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all text-gray-900 dark:text-gray-100 font-medium"
                  placeholder="Email address"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all text-gray-900 dark:text-gray-100 font-medium"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white dark:bg-white dark:text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
              <span className="bg-white dark:bg-[#1A1A1A] px-4 text-gray-400">Or join with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-bold text-sm">
              <Chrome className="w-4 h-4" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-bold text-sm">
              <Github className="w-4 h-4" /> GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-500 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-900 dark:text-white font-black underline underline-offset-4">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
