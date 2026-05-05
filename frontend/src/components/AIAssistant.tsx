"use client";

import { Sparkles, Brain, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function AIAssistant() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 p-6 rounded-[2.5rem] shadow-2xl mb-4 pointer-events-auto min-w-[200px]"
          >
            <div className="flex flex-col items-center text-center gap-3">
               <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                  <Bot className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">AI Assistant</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Status: Calibrating</p>
               </div>
               <div className="mt-2 py-2 px-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  Coming Soon
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="pointer-events-auto relative group"
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
        
        <div className="relative w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-active:scale-90 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <Sparkles className="w-7 h-7 relative z-10 group-hover:animate-pulse" />
        </div>
        
        {/* Tooltip for mobile or non-hover */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap shadow-xl">
           Ask AI
        </div>
      </button>
    </div>
  );
}
