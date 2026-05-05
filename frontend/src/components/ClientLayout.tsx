"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";




export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  // Only Landing Page (unauthenticated), Login, and Signup should be full width
  const isLandingPage = pathname === "/" && !isAuthenticated;
  const isAuthSpecificPage = pathname === "/login" || pathname === "/signup";
  const isProfilePage = pathname === "/profile";

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  if (isProfilePage) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLandingPage || isAuthSpecificPage) {
    return (
      <AnimatePresence mode="wait">
        <motion.main 
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="min-h-screen w-full overflow-x-hidden flex flex-col"
        >
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </motion.main>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main 
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="flex-1 w-full overflow-x-hidden"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </div>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <AIAssistant />
    </div>



  );
}
