"use client";

import { useEffect, useState } from "react";
import { X, UserPlus, UserCheck } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
  title: string;
}

export default function FollowModal({ isOpen, onClose, userId, type, title }: FollowModalProps) {
  const { user: currentUser } = useAuthStore();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchData = async () => {
        try {
          const res = await api.get(`/social/${type}/${userId}`);
          setList(type === "followers" ? res.data.followers : res.data.following);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, userId, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0D0D0D] w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse mb-3" />)
          ) : list.length > 0 ? (
            list.map((u) => (
              <div key={u._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-2xl transition-all group">
                <Link href={`/profile/${u.username}`} onClick={onClose} className="flex items-center gap-3">
                  <img 
                    src={u.profileImage || `https://ui-avatars.com/api/?name=${u.name}&background=ffffff&color=000&bold=true`} 
                    className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-800" 
                  />
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-gray-100 leading-none mb-1 group-hover:text-blue-500 transition-colors">{u.name}</p>
                    <p className="text-[11px] text-gray-400 font-bold">@{u.username}</p>
                  </div>
                </Link>
                
                {currentUser?.id !== u._id && (
                   <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                      <UserPlus className="w-5 h-5" />
                   </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 font-bold">No {type} yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
