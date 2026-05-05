"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Plus, ChevronLeft, FileText, Calendar, Edit3, Trash2, AlertTriangle, X } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { format } from "date-fns";

export default function FolderViewPage() {
  const { folderId } = useParams();
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  
  const [folder, setFolder] = useState<{ _id: string; name: string } | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [deleteBlogModalOpen, setDeleteBlogModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<any>(null);
  const [deleteInput, setDeleteInput] = useState("");

  const fetchData = async () => {
    try {
      // Fetch folder details
      const folderRes = await api.get(`/folders/${folderId}`);
      setFolder(folderRes.data.folder);

      // Fetch folder blogs
      const blogsRes = await api.get(`/folders/${folderId}/blogs`);
      setBlogs(blogsRes.data.blogs);
    } catch (error) {
      console.error("Failed to fetch folder data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuth().then(() => {
      if (folderId) fetchData();
    });
  }, [folderId]);

  const handleDeleteBlog = async () => {
    if (deleteInput.trim() !== `delete-${blogToDelete?.title?.trim()}`) return;

    try {
      await api.delete(`/blogs/${blogToDelete._id}`);
      setBlogs(blogs.filter(b => b._id !== blogToDelete._id));
      setDeleteBlogModalOpen(false);
      setBlogToDelete(null);
      setDeleteInput("");
    } catch (error) {
      console.error("Failed to delete blog", error);
    }
  };

  if (isLoading) {
    return <div className="max-w-3xl mx-auto py-20 text-center text-gray-500 font-bold animate-pulse">Loading folder...</div>;
  }

  if (!folder) {
    return <div className="max-w-3xl mx-auto py-20 text-center text-gray-500 font-bold">Folder not found.</div>;
  }

  const folderName = folder.name;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Breadcrumbs & Back */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-[0.2em] font-sans">
          <Link href="/write" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Write</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">{folderName}</span>
        </div>
      </div>

      {/* Header with New Blog Button */}
      <div className="flex flex-col items-center text-center gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100">{folderName}</h1>
          <p className="text-gray-500 font-sans max-w-md">Manage your articles or create a new masterpiece.</p>
        </div>
        
        <Link 
          href={`/write/${folderId}/editor`}
          className="bg-gray-900 text-gray-100 dark:bg-gray-100 dark:text-gray-900 px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-black/10 dark:shadow-white/10"
        >
          <Plus className="w-5 h-5" />
          <span>New Blog</span>
        </Link>
      </div>

      {/* Blogs List */}
      <div className="space-y-4">
        {blogs.length > 0 ? (
          blogs.map((blog: any) => (
            <div 
              key={blog._id}
              className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-900 dark:hover:border-gray-100 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-2xl text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">{blog.title || "Untitled Blog"}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-500 font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> 
                      {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                    </span>
                    <span className={blog.isPublished ? "text-green-500" : "text-yellow-500"}>
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link 
                  href={`/write/${folderId}/editor?id=${blog._id}`}
                  className="p-3 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl transition-all"
                >
                  <Edit3 className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => {
                    setBlogToDelete(blog);
                    setDeleteInput("");
                    setDeleteBlogModalOpen(true);
                  }}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-gray-900/20 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
            <p className="text-gray-400 font-bold mb-4 font-sans">No blogs in this folder yet.</p>
            <Link 
              href={`/write/${folderId}/editor`}
              className="text-gray-900 dark:text-gray-100 underline font-black hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Start your first blog
            </Link>
          </div>
        )}
      </div>

      {/* Delete Blog Modal */}
      {deleteBlogModalOpen && blogToDelete && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111111] w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative border border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => { setDeleteBlogModalOpen(false); setBlogToDelete(null); }}
              className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-900 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="p-4 bg-red-100 dark:bg-red-500/10 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">Delete Blog</h2>
              <p className="text-sm text-gray-500 font-medium mt-2">
                This action cannot be undone. This will permanently delete the blog 
                <span className="font-bold text-gray-900 dark:text-gray-100"> {blogToDelete.title}</span>.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Type <span className="font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded">delete-{blogToDelete.title?.trim()}</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => { setDeleteBlogModalOpen(false); setBlogToDelete(null); }}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBlog}
                  disabled={deleteInput.trim() !== `delete-${blogToDelete.title?.trim()}`}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
