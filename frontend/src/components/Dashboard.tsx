"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/ui/BlogCard";
import {
  TrendingUp,
  Clock,
  ChevronRight,
  Plus,
  Heart,
  Eye,
  Sparkles
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { user, checkAuth } = useAuthStore();
  const [popularBlogs, setPopularBlogs] = useState<any[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    const fetchBlogs = async () => {
      try {
        const [popularRes, latestRes] = await Promise.all([
          api.get("/blogs?sort=popular"),
          api.get("/blogs?sort=latest")
        ]);
        setPopularBlogs(popularRes.data.blogs.slice(0, 3));
        setLatestBlogs(latestRes.data.blogs.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="space-y-12">
      {/* Greeting & Write Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10 border-b border-gray-100 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100">
              Hi, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-gray-500 font-medium text-sm md:text-base">Ready to discover something new today?</p>
        </div>

        <Link href="/write" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-gray-900 text-gray-100 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-black/10 active:scale-95 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Write Blog</span>
          </button>
        </Link>
      </div>

      {/* Popular Blogs */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100">Trending Now</h2>
          </div>
          <button className="text-gray-400 hover:text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 transition-colors">
            See all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map((i) => <div key={i} className="h-80 bg-gray-100 dark:bg-[#1A1A1A] rounded-[2.5rem] animate-pulse" />)
          ) : popularBlogs.length > 0 ? (
            popularBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={{
                  ...blog,
                  id: blog._id,
                  likesCount: blog.likesCount || 0,
                  tags: blog.tags || ['Uncategorized'],
                  author: blog.author || { name: 'Unknown', profileImage: '' }
                }}
                type="popular"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] text-gray-400 font-bold uppercase tracking-widest border-2 border-dashed border-gray-100 dark:border-gray-800">
              No popular blogs found
            </div>
          )}
        </div>
      </section>

      {/* Latest Blogs */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100">Recent Posts</h2>
          </div>

          <button className="text-gray-400 hover:text-purple-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 transition-colors">
            See all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            [1, 2].map((i) => <div key={i} className="h-40 bg-gray-100 dark:bg-[#1A1A1A] rounded-[2.5rem] animate-pulse" />)
          ) : latestBlogs.length > 0 ? (
            latestBlogs.map((blog) => (
              <Link href={`/blog/${blog._id}`} key={blog._id}>
                <div className="bg-white dark:bg-[#0D0D0D] p-5 rounded-[2rem] border-2 border-gray-50 dark:border-gray-900 flex flex-col sm:flex-row gap-6 group hover:border-purple-500/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-purple-500/5">
                  <div className="w-full sm:w-56 h-48 sm:h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-gray-900 flex items-center justify-center font-black text-gray-200 dark:text-gray-800 text-[10px] uppercase tracking-widest">
                    {blog.coverImage ? <img src={blog.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={blog.title} /> : "ThoughtSpace"}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">{blog.tags?.[0] || 'Uncategorized'}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {blog.createdAt ? formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true }) : ''}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 group-hover:text-purple-500 transition-colors mb-2 line-clamp-1">{blog.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed">{blog.content?.substring(0, 150).replace(/<[^>]+>/g, '') || 'No description available...'}</p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-900/50">
                      <div className="flex items-center gap-3">
                        <img src={blog.author?.profileImage || `https://ui-avatars.com/api/?name=${blog.author?.name || 'User'}&background=ffffff&color=000&bold=true`} className="w-6 h-6 rounded-full border-2 border-gray-100 dark:border-gray-800" />
                        <span className="text-xs font-black text-gray-700 dark:text-gray-300">{blog.author?.name || "Author"}</span>
                        <span className="hidden xs:inline text-xs text-gray-300 dark:text-gray-700">•</span>
                        <span className="hidden xs:inline text-xs font-bold text-gray-400">{blog.readTime || "5m read"}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/5 rounded-full text-rose-500">
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span className="text-[10px] font-black">{blog.likesCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/5 rounded-full text-blue-500">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black">{blog.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">No latest blogs found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
