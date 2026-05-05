"use client";

import { useEffect, useState } from "react";
import { Heart, UserPlus, Bookmark, Bell, ArrowLeft, Filter, Sparkles } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";
import { formatDistanceToNow, subDays, isAfter } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all"); // all, like, follow, bookmark

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/social/notifications");
        // Filter for last 15 days on frontend for simplicity and responsiveness
        const fifteenDaysAgo = subDays(new Date(), 15);
        const recentNotifications = res.data.notifications.filter((n: any) => 
          isAfter(new Date(n.createdAt), fifteenDaysAgo)
        );
        setNotifications(recentNotifications);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(n => 
    filter === "all" ? true : n.type === filter
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="w-4 h-4 text-rose-500 fill-current" />;
      case "follow": return <UserPlus className="w-4 h-4 text-blue-500" />;
      case "bookmark": return <Bookmark className="w-4 h-4 text-purple-500 fill-current" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMessage = (notif: any) => {
    switch (notif.type) {
      case "like": return <span>liked your blog <span className="font-black text-gray-900 dark:text-gray-100">"{notif.blog?.title}"</span></span>;
      case "follow": return <span>started following you</span>;
      case "bookmark": return <span>saved your blog <span className="font-black text-gray-900 dark:text-gray-100">"{notif.blog?.title}"</span></span>;
      default: return "interacted with you";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Explore
      </Link>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl">
                 <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Activity</h1>
           </div>
           <p className="text-gray-500 font-medium">Your last 15 days of community interactions.</p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-gray-800">
           {['all', 'like', 'follow', 'bookmark'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
             >
               {f === 'all' ? 'All' : f + 's'}
             </button>
           ))}
        </div>
      </header>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-[#1A1A1A] rounded-3xl animate-pulse" />
          ))
        ) : filteredNotifications.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((n, index) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-[#0D0D0D] p-6 rounded-[2rem] border-2 border-gray-50 dark:border-gray-900 hover:border-blue-500/30 transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img 
                      src={n.sender?.profileImage || `https://ui-avatars.com/api/?name=${n.sender?.name}&background=ffffff&color=000&bold=true`} 
                      className="w-12 h-12 rounded-full border-2 border-gray-100 dark:border-gray-800 group-hover:scale-110 transition-transform" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black p-1 rounded-full shadow-lg border border-gray-50 dark:border-gray-800">
                       {getIcon(n.type)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <Link href={`/profile/${n.sender?.username}`} className="font-black text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                        {n.sender?.name}
                      </Link>
                      {" "}{getMessage(n)}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                       {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                {n.blog && (
                  <Link 
                    href={`/blog/${n.blog._id}`}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-[10px] font-black text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all uppercase tracking-widest"
                  >
                    View Blog
                  </Link>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-32 bg-gray-50/50 dark:bg-[#111111]/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
             <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Bell className="w-8 h-8 text-gray-300" />
             </div>
             <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-widest">Quiet in here</h3>
             <p className="text-gray-400 text-sm font-medium">No {filter !== 'all' ? filter + ' ' : ''}activity found in the last 15 days.</p>
          </div>
        )}
      </div>
    </div>
  );
}
