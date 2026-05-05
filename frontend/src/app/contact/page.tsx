"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";


export default function ContactPage() {

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
             <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Let's Connect.</h1>
             <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">
               Have questions about ThoughtSpace or want to discuss a partnership? I'm always open to meaningful conversations.
             </p>
          </div>

          <div className="space-y-6 pt-6">
             <div className="flex items-center gap-4 group">
                <div className="p-4 bg-blue-500/10 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <Mail className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Email me</p>
                   <p className="text-sm font-bold text-gray-900 dark:text-gray-100">guptakishann957@gmail.com</p>

                </div>
             </div>

             <a 
               href="https://wa.me/919111472413?text=Hi%20Kishan,%20I'm%20reaching%20out%20from%20ThoughtSpace!"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-4 group cursor-pointer"
             >
                <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                   <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Chat with me</p>
                   <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Connect on WhatsApp</p>
                </div>
             </a>

          </div>
        </motion.div>

        {/* Right Side: Calendly */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-[#0D0D0D] border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden min-h-[500px] flex flex-col"
        >
           <div className="p-8 border-b border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Calendar className="w-5 h-5 text-blue-600" />
                 <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Book a Session</h3>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           </div>
           
           <div className="flex-1">
              {/* Calendly Inline Widget */}
              <iframe
                src="https://calendly.com/kishangupta-code/30min?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=2563eb"
                width="100%"
                height="100%"
                frameBorder="0"
                className="min-h-[500px]"
              ></iframe>

           </div>
        </motion.div>
      </div>
    </div>


  );
}
