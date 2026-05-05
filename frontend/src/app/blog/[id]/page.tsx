"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Bookmark, Share2, ChevronLeft, UserPlus, UserCheck } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

export default function BlogViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        let viewParam = "";
        const lastViewTime = sessionStorage.getItem(`lastView_${id}`);
        const now = Date.now();
        
        // 5-second cooldown to prevent React Strict Mode double-firing
        if (!lastViewTime || (now - parseInt(lastViewTime)) > 5000) {
          viewParam = "?view=true";
          sessionStorage.setItem(`lastView_${id}`, now.toString());
        }


        const res = await api.get(`/blogs/${id}${viewParam}`);
        setBlog(res.data.blog);
        setIsLiked(res.data.blog.likes.some((uid: string) => uid === user?.id));

        if (user) {
          const meRes = await api.get("/auth/me");
          setIsBookmarked(meRes.data.user.bookmarks?.some((bid: string) => bid === id));
        }

        if (user && res.data.blog.author) {
          const profileRes = await api.get(`/auth/profile/${res.data.blog.author.username}`);
          setIsFollowing(profileRes.data.user.isFollowing);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, user]);

  const handleLike = async () => {
    try {
      const res = await api.post("/social/like", { blogId: id });
      setIsLiked(res.data.isLiked);
      setBlog((prev: any) => ({
        ...prev,
        likes: res.data.isLiked
          ? [...prev.likes, user?.id]
          : prev.likes.filter((uid: string) => uid !== user?.id)
      }));
    } catch (error) {
      toast.error("Failed to like blog");
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await api.post("/social/bookmark", { blogId: id });
      setIsBookmarked(res.data.isBookmarked);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to bookmark blog");
    }
  };

  const handleFollow = async () => {
    try {
      const res = await api.post("/social/follow", { followingId: blog.author._id });
      setIsFollowing(res.data.isFollowing);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to follow user");
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard! Share it with your friends.");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };


  if (loading) return <div className="max-w-3xl mx-auto py-20 px-6 animate-pulse bg-gray-50 dark:bg-gray-900 rounded-[3rem] h-screen" />;

  if (!blog) return <div className="text-center py-20 font-bold">Blog not found.</div>;

  const isAuthor = user?.id === blog.author?._id;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 pb-40 md:pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 md:mb-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 uppercase tracking-widest transition-all">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to feed</span>
          <span className="sm:hidden">Back</span>
        </button>
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={handleShare}
            className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all active:scale-90"
          >
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {!isAuthor && (
            <button
              onClick={handleFollow}
              className={`flex items-center gap-2 px-5 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${isFollowing
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                }`}
            >
              {isFollowing ? <UserCheck className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4" />}
              <span>{isFollowing ? "Following" : "Follow"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Author & Meta */}
      <div className="flex items-center gap-4 mb-8 md:mb-10">
        <img
          src={blog.author?.profileImage || `https://ui-avatars.com/api/?name=${blog.author?.name}&background=ffffff&color=000&bold=true`}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-gray-50 dark:border-gray-900 shadow-lg"
        />
        <div>
          <h4 className="text-lg md:text-xl font-black text-gray-900 dark:text-gray-100 leading-none mb-1">{blog.author?.name}</h4>
          <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-tight">
            @{blog.author?.username || 'user'} • {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-100 mb-8 md:mb-10 leading-tight tracking-tight">
        {blog.title}
      </h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
         {blog.tags?.map((tag: string) => (
           <span key={tag} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">
             {tag}
           </span>
         ))}
      </div>

      {/* Cover */}
      {blog.coverImage && (
        <div className="mb-10 md:mb-12 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-2 md:border-4 border-gray-50 dark:border-gray-900 shadow-2xl shadow-black/10">
          <img src={blog.coverImage} className="w-full h-auto" alt={blog.title} />
        </div>
      )}

      {/* Content */}
      <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none font-sans text-gray-700 dark:text-gray-300 leading-relaxed md:leading-extra-relaxed mb-20" dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* Floating Interaction Bar */}
      <div className="fixed bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2 bg-white/90 dark:bg-black/90 backdrop-blur-2xl p-1.5 md:p-2 rounded-full border border-gray-100 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 md:gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-full transition-all active:scale-90 ${isLiked ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
        >
          <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-black text-xs md:text-sm">{blog.likes?.length || 0}</span>
        </button>
        <div className="w-[1px] h-6 bg-gray-100 dark:bg-gray-800 mx-0.5 md:mx-1" />
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-2 md:gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-full transition-all active:scale-90 ${isBookmarked ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
        >
          <Bookmark className={`w-4 h-4 md:w-5 md:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          <span className="font-black text-xs md:text-sm">{isBookmarked ? "Saved" : "Save"}</span>
        </button>
      </div>
    </div>
  );
}
