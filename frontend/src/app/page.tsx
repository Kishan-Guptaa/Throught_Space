"use client";

import { useAuthStore } from "@/store/useAuthStore";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <LandingPage />;
}
