"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "919111472413"; // Including country code for India
  const message = "Hi Kishan, I'm reaching out from ThoughtSpace!";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Ping Animation */}
        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20 group-hover:opacity-40" />
        
        {/* Button */}
        <div className="relative bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/40 transition-all duration-300 hover:scale-110 active:scale-90 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 fill-current" />
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-2 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-4 group-hover:translate-x-0 whitespace-nowrap">
           <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Chat on WhatsApp</p>
        </div>
      </div>
    </a>
  );
}
