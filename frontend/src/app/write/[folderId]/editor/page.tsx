"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Image, Heading1, ChevronLeft, Save, Send, Eye, X } from "lucide-react";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
import toast from "react-hot-toast";
import api from "@/lib/axios";

export default function EditorPage() {
  const { folderId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Load existing blog if editing
  useEffect(() => {
    if (blogId) {
      api.get(`/blogs/${blogId}`).then(res => {
        setTitle(res.data.blog.title || "");
        setContent(res.data.blog.content || "");
        setCoverImage(res.data.blog.coverImage || "");
        setIsPublished(res.data.blog.isPublished || false);
      }).catch(err => {
        console.error("Failed to load blog", err);
      });
    }
  }, [blogId]);

  const saveBlog = async (publish: boolean, isAutoSave = false) => {
    if (!title || !content) return;

    if (!isAutoSave) setIsSaving(true);
    
    try {
      const payload = {
        title,
        content,
        coverImage,
        folder: folderId,
        isPublished: publish
      };

      if (blogId) {
        await api.put(`/blogs/${blogId}`, payload);
      } else if (!isAutoSave) {
        // Only create new via manual save to avoid accidental empty drafts
        const response = await api.post("/blogs", payload);
        const newId = response.data.blog._id;
        router.replace(`/write/${folderId}/editor?id=${newId}`);
      }

      if (!isAutoSave) {
        setIsPublished(publish);
        toast.success(publish ? "Blog published!" : "Draft saved!");
        if (publish) router.push(`/write/${folderId}`);
      }
    } catch (error) {
      console.error(error);
      if (!isAutoSave) toast.error("Failed to save.");
    } finally {
      if (!isAutoSave) setIsSaving(false);
    }
  };

  // Debounced Auto-save
  useEffect(() => {
    if (!blogId || isPublished) return; // Only auto-save drafts that already have an ID

    const timeout = setTimeout(() => {
      saveBlog(false, true);
    }, 3000); // 3 second debounce

    return () => clearTimeout(timeout);
  }, [title, content, coverImage]);

  return (
    <div className="max-w-3xl mx-auto space-y-12 pt-10 pb-20 relative min-h-screen">
      {/* Top Actions (Inline) */}
      <div className="flex items-center justify-between mb-12">
         <Link 
          href={`/write/${folderId}`}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors uppercase tracking-[0.2em]"
         >
           <ChevronLeft className="w-4 h-4" />
           Back
         </Link>
         
         <div className="flex items-center gap-3">
            <button 
              disabled={isSaving}
              onClick={() => saveBlog(false)}
              className="px-5 py-2.5 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-900 dark:hover:text-gray-100 transition-all text-xs uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-gray-400" />
              {isPublished ? "Draft" : "Save Draft"}
            </button>
            <button 
              disabled={isSaving}
              onClick={() => saveBlog(true)}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black transition-all text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isPublished ? "Update" : "Publish"}
              {!isSaving && <Send className="w-3.5 h-3.5" />}
            </button>
         </div>
      </div>

      {/* Editor Content Area */}
      <div className="space-y-8 relative group/editor">
        
        {/* Cover Image Display */}
        {coverImage && (
          <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden group/cover mb-8">
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            <button 
              onClick={() => setCoverImage("")}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover/cover:opacity-100 transition-all backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Action Links */}
        {!coverImage && (
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 font-sans opacity-0 group-hover/editor:opacity-100 transition-opacity duration-300 absolute -top-8 left-0">
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
             >
               <Image className="w-3.5 h-3.5" />
               Add Cover
             </button>
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleImageUpload} 
               accept="image/*" 
               className="hidden" 
             />
          </div>
        )}

        <textarea 
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          placeholder="Article Title..."
          rows={1}
          className="w-full bg-transparent text-5xl md:text-6xl font-black text-gray-900 dark:text-gray-100 focus:outline-none placeholder:text-gray-200 dark:placeholder:text-gray-800 tracking-tight leading-tight resize-none overflow-hidden"
        />

        <Editor content={content} onChange={setContent} />
      </div>

    </div>
  );
}
