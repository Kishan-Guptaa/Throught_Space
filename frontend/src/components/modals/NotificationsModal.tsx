"use client";

import { useEffect, useState, useRef } from "react";
import { Heart, UserPlus, Bookmark, Bell, Sparkles, X } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/social/notifications");
      setNotifications(res.data.notifications);
      // Mark as read when opened
      await api.put("/social/notifications/read");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />;
      case "follow": return <UserPlus className="w-3.5 h-3.5 text-blue-500" />;
      case "bookmark": return <Bookmark className="w-3.5 h-3.5 text-purple-500 fill-current" />;
      default: return <Bell className="w-3.5 h-3.5 text-gray-500" />;
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
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-4 w-[380px] bg-white dark:bg-[#0D0D0D] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
           <Bell className="w-4 h-4 text-blue-600" />
           <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Notifications</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="p-5 flex gap-4 animate-pulse border-b border-gray-50 dark:border-gray-900/50">
               <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800" />
               <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
               </div>
            </div>
          ))
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n._id} className={`p-5 border-b border-gray-50 dark:border-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group ${!n.read ? 'bg-blue-50/30 dark:bg-blue-500/5' : ''}`}>
              <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src={n.sender?.profileImage || `https://ui-avatars.com/api/?name=${n.sender?.name}&background=ffffff&color=000&bold=true`} 
                    className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800" 
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0D0D0D] p-1 rounded-full shadow-sm border border-gray-50 dark:border-gray-800">
                     {getIcon(n.type)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-snug">
                    <Link href={`/profile/${n.sender?.username}`} onClick={onClose} className="font-black text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
                      {n.sender?.name}
                    </Link>
                    {" "}{getMessage(n)}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1.5 flex items-center gap-1.5 uppercase tracking-tighter">
                     {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 px-8">
             <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-700">
                <Bell className="w-6 h-6" />
             </div>
             <p className="text-xs font-black text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-widest">No notifications yet</p>
             <p className="text-[10px] text-gray-400 font-bold">Interactions will appear here</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 text-center">
         <Link href="/notifications" onClick={onClose} className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em] transition-all">
           View All Activity
         </Link>
      </div>
    </div>
  );
}
