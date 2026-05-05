"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserPlus, UserCheck, ChevronLeft, MessageSquare, Twitter, Github, Linkedin, Instagram } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import BlogCard from "@/components/ui/BlogCard";
import FollowModal from "@/components/modals/FollowModal";
import toast from "react-hot-toast";

export default function PublicProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<"followers" | "following">("followers");
  const [followModalTitle, setFollowModalTitle] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, blogsRes] = await Promise.all([
          api.get(`/auth/profile/${username}`),
          api.get(`/blogs?username=${username}`)
        ]);
        setProfile(profileRes.data.user);
        setIsFollowing(profileRes.data.user.isFollowing);
        setBlogs(blogsRes.data.blogs);
      } catch (error) {
        console.error(error);
        toast.error("User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [username]);

  const handleOpenFollowers = () => {
    setFollowModalType("followers");
    setFollowModalTitle("Followers");
    setIsFollowModalOpen(true);
  };

  const handleOpenFollowing = () => {
    setFollowModalType("following");
    setFollowModalTitle("Following");
    setIsFollowModalOpen(true);
  };

  const handleFollow = async () => {
    try {
      const res = await api.post("/social/follow", { followingId: profile.id });
      setIsFollowing(res.data.isFollowing);
      setProfile((prev: any) => ({
        ...prev,
        followersCount: res.data.isFollowing ? prev.followersCount + 1 : prev.followersCount - 1
      }));
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to follow user");
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto py-20 animate-pulse bg-gray-50 dark:bg-gray-900 h-screen rounded-3xl" />;
  if (!profile) return <div className="text-center py-20 font-black">User not found</div>;

  const isSelf = currentUser?.username === profile.username;
  const socialLinks = profile.socialLinks || {};

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 md:px-0">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 uppercase tracking-widest transition-all mb-10">
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <FollowModal 
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        userId={profile.id}
        type={followModalType}
        title={followModalTitle}
      />

      {/* Profile Header */}
      <div className="bg-white dark:bg-[#0D0D0D] border-2 border-gray-100 dark:border-gray-800 rounded-[3rem] p-10 shadow-2xl mb-12 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
         
         <div className="relative flex flex-col md:flex-row items-start md:items-end gap-8">
            <img 
              src={profile.profileImage || `https://ui-avatars.com/api/?name=${profile.name}&background=ffffff&color=000&bold=true`} 
              className="w-40 h-40 rounded-[2.5rem] border-8 border-white dark:border-[#0D0D0D] shadow-2xl z-10" 
            />
            
            <div className="flex-1 pb-2">
               <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-1">{profile.name}</h1>
               <p className="text-gray-500 font-bold mb-4">@{profile.username}</p>
               
               <div className="flex items-center gap-6 text-sm">
                  <div 
                    onClick={handleOpenFollowing}
                    className="flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span className="font-black text-gray-900 dark:text-gray-100">{profile.followingCount}</span>
                    <span className="text-gray-400 font-bold">Following</span>
                  </div>
                  <div 
                    onClick={handleOpenFollowers}
                    className="flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span className="font-black text-gray-900 dark:text-gray-100">{profile.followersCount}</span>
                    <span className="text-gray-400 font-bold">Followers</span>
                  </div>
               </div>
            </div>

            {!isSelf && (
              <div className="flex gap-3 mb-2">
                 <button className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl hover:bg-gray-100 transition-all text-gray-500">
                    <MessageSquare className="w-5 h-5" />
                 </button>
                 <button 
                  onClick={handleFollow}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    isFollowing 
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                  }`}
                >
                  {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            )}
         </div>

         <div className="mt-8 flex items-center gap-4">
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-900 dark:hover:border-white transition-all">
                <Github className="w-5 h-5" />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-900 dark:hover:border-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-900 dark:hover:border-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-500 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            )}
         </div>

         {profile.bio && <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl text-lg">{profile.bio}</p>}
      </div>

      {/* User's Blogs */}
      <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-8 px-6">Articles by {profile.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard key={blog._id} blog={{...blog, id: blog._id}} />
          ))
        ) : (
          <div className="col-span-2 text-center py-20 text-gray-400 font-bold bg-gray-50/50 dark:bg-gray-900/20 rounded-[2.5rem]">
            This user hasn't published any blogs yet.
          </div>
        )}
      </div>
    </div>
  );
}
