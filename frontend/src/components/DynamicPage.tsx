"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DynamicPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await api.get(`/pages/${slug}`);
        setPage(res.data.page);
      } catch (error) {
        console.error("Failed to fetch page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 space-y-8 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl w-3/4" />
        <div className="space-y-4">
           <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded w-full" />
           <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded w-5/6" />
           <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Page Not Found</h1>
        <Link href="/" className="text-blue-600 font-bold mt-4 block">Return Home</Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-10 px-6"
    >
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Explore
      </Link>

      <header className="mb-12">
        <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
          {page.title}
        </h1>
        <div className="flex items-center gap-6 text-gray-400 text-xs font-black uppercase tracking-widest">
           <div className="flex items-center gap-2">
             <Calendar className="w-4 h-4" />
             <span>Last Updated: {format(new Date(page.updatedAt), 'MMMM dd, yyyy')}</span>
           </div>
           <div className="flex items-center gap-2">
             <Clock className="w-4 h-4" />
             <span>Official Document</span>
           </div>
        </div>
      </header>

      <div 
        className="prose prose-lg dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-600 dark:prose-p:text-gray-400 max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />

      <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
         <p className="text-sm text-gray-400 font-medium">
           Questions about this page? <Link href="/" className="text-blue-600 font-black underline underline-offset-4">Contact Support</Link>
         </p>
      </div>
    </motion.article>
  );
}
