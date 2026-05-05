"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Mail, Calendar, Settings, Grid, BookOpen, UserPlus, Twitter, Github, Linkedin, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import EditProfileModal from "@/components/modals/EditProfileModal";
import FollowModal from "@/components/modals/FollowModal";
import SuggestedUsersModal from "@/components/modals/SuggestedUsersModal";
import api from "@/lib/axios";
import Link from "next/link";


export default function ProfilePage() {
  const { user, checkAuth, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("blogs");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<"followers" | "following">("followers");
  const [followModalTitle, setFollowModalTitle] = useState("");
  const [isSuggestedModalOpen, setIsSuggestedModalOpen] = useState(false);


  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?.id || (user as any)?._id) {
      const fetchUserBlogs = async () => {
        try {
          const userId = user.id || (user as any)._id;
          const res = await api.get(`/blogs?author=${userId}`);
          setBlogs(res.data.blogs);
        } catch (error) {
          console.error("Failed to fetch user blogs:", error);
        } finally {
          setIsLoadingBlogs(false);
        }
      };
      fetchUserBlogs();
    } else if (!isLoading) {
      setIsLoadingBlogs(false);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const joinedDate = (user as any)?.createdAt
    ? format(new Date((user as any).createdAt), "MMMM yyyy")
    : "Recently";

  const stats = [
    { label: "Blogs", value: blogs.length.toString() },
    {
      label: "Followers",
      value: ((user as any)?.followersCount || 0).toString(),
      onClick: () => {
        setFollowModalType("followers");
        setFollowModalTitle("Followers");
        setIsFollowModalOpen(true);
      }
    },
    {
      label: "Following",
      value: ((user as any)?.followingCount || 0).toString(),
      onClick: () => {
        setFollowModalType("following");
        setFollowModalTitle("Following");
        setIsFollowModalOpen(true);
      }
    },
  ];

  const socialLinks = (user as any)?.socialLinks || {};

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <FollowModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        userId={user?.id || (user as any)?._id}
        type={followModalType}
        title={followModalTitle}
      />

      <SuggestedUsersModal
        isOpen={isSuggestedModalOpen}
        onClose={() => setIsSuggestedModalOpen(false)}
      />

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-[#111111] shadow-2xl overflow-hidden">
            <img
              src={(user as any)?.profileImage || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=000&color=fff&size=256&bold=true`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 right-1/2 translate-x-1/2 flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white dark:border-[#0D0D0D]"
              title="Edit Profile"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100">{user?.name}</h1>
          <p className="text-sm font-bold text-gray-400">@{(user as any)?.username || "username"}</p>
          <p className="text-gray-500 font-medium max-w-md mx-auto pt-2">
            {(user as any)?.bio || "No bio available yet. Click 'Edit Profile' to add one!"}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-12 pt-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn("text-center", (stat as any).onClick && "cursor-pointer hover:scale-110 transition-transform")}
              onClick={(stat as any).onClick}
            >
              <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{stat.value}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-8 py-3 bg-gray-900 text-white dark:bg-white dark:text-black rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-black/10"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setIsSuggestedModalOpen(true)}
            className="p-3 bg-gray-100 dark:bg-gray-900 rounded-2xl text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Who to Follow"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>

        {/* Social Links Section */}
        <div className="flex items-center gap-4 pt-2">
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
          {!socialLinks.github && !socialLinks.twitter && !socialLinks.linkedin && !socialLinks.instagram && (
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No social links added</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-8">
        <div className="flex items-center justify-center gap-8 border-b border-gray-100 dark:border-gray-900">
          {[
            { id: "blogs", name: "Your Blogs", icon: Grid },
            { id: "about", name: "About", icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 py-4 text-sm font-bold transition-all relative",
                activeTab === tab.id
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === "blogs" ? (
            <div className="grid grid-cols-1 gap-6">
              {isLoadingBlogs ? (
                [1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-200 dark:bg-[#1A1A1A] rounded-3xl animate-pulse" />)
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <Link href={`/blog/${blog._id}`} key={blog._id}>
                    <div className="group flex items-center gap-6 p-6 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-[2rem] hover:border-gray-900 dark:hover:border-100 transition-all">
                      <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center font-black text-gray-300 dark:text-gray-700 text-[10px]">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt="Blog" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : "ThoughtSpace"}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{blog.createdAt ? format(new Date(blog.createdAt), "MMM dd, yyyy") : ""}</div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 leading-tight">{blog.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{blog.content?.substring(0, 100).replace(/<[^>]+>/g, '') || 'No description...'}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 font-medium border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                  <p className="mb-4">You haven't written any blogs yet.</p>
                  <Link href="/write">
                    <button className="px-6 py-2 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">
                      Start Writing
                    </button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 text-gray-500 font-medium">
              <div className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] space-y-4">
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">The Journey</h3>
                <p>{(user as any)?.bio || "Add a bio to tell others about yourself!"}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-[2rem] flex items-center gap-4">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{user?.email}</div>
                </div>
                <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-[2rem] flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Joined {joinedDate}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
