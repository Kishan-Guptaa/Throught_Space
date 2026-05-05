"use client";

import { Heart, Bookmark, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";

interface BlogCardProps {
  blog: {
    id: number | string;
    title: string;
    coverImage: string;
    tags: string[];
    views: number;
    createdAt: string;
    author: {
      name: string;
      profileImage: string;
    };
    likesCount: number;
    bookmarksCount: number;
    readTime?: string;
  };
  type?: "popular" | "latest";
  isBookmarkedInitially?: boolean;
}

export default function BlogCard({ blog, type = "popular", isBookmarkedInitially = false }: BlogCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitially);

  const tagColor = blog.tags?.[0] === "JavaScript" ? "text-gray-700 dark:text-gray-300" : 
                   blog.tags?.[0] === "System Design" ? "text-gray-600 dark:text-gray-500" : 
                   "text-gray-900 dark:text-gray-100";

  const tagBg = blog.tags?.[0] === "JavaScript" ? "bg-gray-200 dark:bg-gray-300/10" : 
                 blog.tags?.[0] === "System Design" ? "bg-gray-200 dark:bg-gray-500/10" : 
                 "bg-gray-100 dark:bg-white/10";

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/blogs/${blog.id}/bookmark`);
      setIsBookmarked(res.data.isBookmarked);
    } catch (error) {
      console.error("Failed to bookmark blog:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full"
    >
      <div className="group bg-[#FDFDFD] dark:bg-[#1A1A1A] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-500 flex flex-col h-full">
        {/* Cover Image */}
        <Link href={`/blog/${blog.id}`} className="block relative h-48 overflow-hidden">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 font-black">
              ThoughtSpace
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-4">
            <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", tagBg, tagColor)}>
              {blog.tags?.[0] || 'Uncategorized'}
            </span>
          </div>

          <Link href={`/blog/${blog.id}`}>
            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-3 leading-tight group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
              {blog.title}
            </h3>
          </Link>
          
          <p className="text-xs text-gray-500 line-clamp-2 mb-6">
            Explore this insightful article about {blog.tags?.[0] || 'topics'} and more on ThoughtSpace.
          </p>

          {/* Footer */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 overflow-hidden">
                   <img src={blog.author.profileImage || `https://ui-avatars.com/api/?name=${blog.author.name}&background=ffffff&color=000&bold=true`} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black text-gray-700 dark:text-gray-300">{blog.author.name}</span>
                   <span className="text-[9px] text-gray-500 dark:text-gray-600 font-bold">{blog.readTime || "5 min read"}</span>
                 </div>
              </div>
              <button onClick={handleBookmark} className="p-1.5 -mr-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <Bookmark className={cn("w-4 h-4 transition-colors", isBookmarked ? "text-gray-900 dark:text-gray-100 fill-current" : "text-gray-400 dark:text-gray-700 hover:text-gray-900 dark:hover:text-gray-100")} />
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Heart className="w-3.5 h-3.5 fill-rose-500/10 text-rose-500" />
                <span className="text-[11px] font-black">{blog.likesCount || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-black">{blog.views || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
