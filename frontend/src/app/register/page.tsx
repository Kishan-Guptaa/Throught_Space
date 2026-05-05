"use client";

import Link from "next/link";
import { useState } from "react";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account created successfully!");
    // Logic to call API
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black mb-2">Join BlogSphere</h1>
          <p className="text-gray-500 dark:text-gray-400">Start your journey with us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-500">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-brand/20"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-brand font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
