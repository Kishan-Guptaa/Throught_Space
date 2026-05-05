"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderPlus, Folder, Plus, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import CreateFolderModal from "@/components/modals/CreateFolderModal";
import DeleteFolderModal from "@/components/modals/DeleteFolderModal";

export default function WritePage() {
  const { checkAuth } = useAuthStore();
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<{ _id: string; name: string } | null>(null);

  const fetchFolders = async () => {
    try {
      const res = await api.get("/folders");
      setFolders(res.data.folders);
    } catch (error) {
      console.error("Failed to fetch folders", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth().then(() => {
      fetchFolders();
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <CreateFolderModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchFolders} 
      />

      <DeleteFolderModal 
        isOpen={!!folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onSuccess={fetchFolders}
        folder={folderToDelete}
      />
      
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100">Select Folder</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-sans">
          Choose a folder to manage your existing blogs or create a new one to start a fresh series.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Folder Card */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="group relative h-48 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-4 hover:border-gray-900 dark:hover:border-gray-100 transition-all"
        >
          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-full group-hover:scale-110 transition-transform">
            <FolderPlus className="w-6 h-6 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
          </div>
          <span className="font-bold text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-100">Create Folder</span>
        </button>

        {/* Existing Folders */}
        {isLoading ? (
          [1, 2].map(i => <div key={i} className="h-48 rounded-3xl bg-gray-200 dark:bg-[#1A1A1A] animate-pulse" />)
        ) : folders.map((folder) => (
          <Link
            key={folder._id}
            href={`/write/${folder._id}`}
            className="group relative h-48 bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 flex flex-col justify-between hover:border-gray-900 dark:hover:border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start">
              <div className={cn("p-3 rounded-2xl", folder.color || "bg-gray-100")}>
                <Folder className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{folder.count || 0} Blogs</span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFolderToDelete(folder);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 group-hover:translate-x-1 transition-transform flex items-center gap-2">
                {folder.name} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-gray-500 font-sans">Manage and write blogs...</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
