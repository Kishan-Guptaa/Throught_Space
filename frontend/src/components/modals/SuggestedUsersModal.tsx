"use client";

import { useEffect, useState } from "react";
import { X, UserPlus, Sparkles } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

interface SuggestedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuggestedUsersModal({ isOpen, onClose }: SuggestedUsersModalProps) {
  const { user: currentUser } = useAuthStore();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/suggested");
      setSuggestions(res.data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen]);

  const handleFollow = async (userId: string, username: string) => {
    try {
      await api.post("/social/follow", { followingId: userId });
      toast.success(`Followed @${username}`);
      // Refresh list or remove followed user
      setSuggestions(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      toast.error("Failed to follow");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0D0D0D] w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-blue-500" />
             <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Who to Follow</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse mb-3" />)
          ) : suggestions.length > 0 ? (
            suggestions.map((u) => (
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
                
                <button 
                  onClick={() => handleFollow(u._id, u.username)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-lg shadow-blue-500/20 active:scale-90"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 font-bold">No suggestions right now.</div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
           <button 
             onClick={fetchSuggestions}
             className="w-full py-3 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
           >
             Refresh Suggestions
           </button>
        </div>
      </div>
    </div>
  );
}
