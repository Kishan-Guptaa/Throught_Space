"use client";

import { useState, useEffect } from "react";
import { Bookmark, Search } from "lucide-react";
import BlogCard from "@/components/ui/BlogCard";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function BookmarksPage() {
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    
    const fetchBookmarks = async () => {
      try {
        const res = await api.get("/blogs/bookmarked");
        setBookmarkedBlogs(res.data.blogs);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 dark:bg-[#1A1A1A] rounded-2xl">
              <Bookmark className="w-6 h-6 text-gray-900 dark:text-gray-100" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100">Bookmarks</h1>
          </div>
          <p className="text-gray-500 font-sans">
            Your personal library of saved articles and inspiration.
          </p>
        </div>

        </div>


      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-[#1A1A1A] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : bookmarkedBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedBlogs.map((blog) => (
            <BlogCard 
              key={blog._id} 
              blog={{
                ...blog, 
                id: blog._id, 
                likesCount: blog.likesCount || 0,

                views: blog.views || 0,
                tags: blog.tags || ['Uncategorized'], 
                author: blog.author || {name: 'Unknown', profileImage: ''}
              }} 
              type="popular" 
              isBookmarkedInitially={true} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-[#1A1A1A] rounded-full flex items-center justify-center mb-2">
            <Bookmark className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100">No bookmarks yet</h3>
          <p className="text-gray-500 max-w-sm font-sans">
            When you find an article you want to read later, click the bookmark icon to save it here.
          </p>
        </div>
      )}
    </div>
  );
}
