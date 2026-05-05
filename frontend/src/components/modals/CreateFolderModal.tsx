"use client";

import { useState } from "react";
import { FolderPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COLORS = [
  "bg-gray-100", "bg-gray-300", "bg-gray-400", "bg-gray-600", "bg-gray-800", "bg-gray-900",
  "bg-blue-100", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-rose-500"
];

export default function CreateFolderModal({ isOpen, onClose, onSuccess }: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    try {
      await api.post("/folders", { name, color });
      setName("");
      setColor(COLORS[0]);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create folder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111111] w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative border border-gray-200 dark:border-gray-800">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-900 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-2xl">
            <FolderPlus className="w-6 h-6 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">New Folder</h2>
            <p className="text-sm text-gray-500 font-medium">Create a new series or topic.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. JavaScript Advanced"
              className="w-full bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all font-medium"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Folder Color</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    c,
                    color === c ? "border-gray-900 dark:border-white scale-110 shadow-lg" : "border-transparent hover:scale-110"
                  )}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full py-4 bg-gray-900 text-white dark:bg-white dark:text-black rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? "Creating..." : "Create Folder"}
          </button>
        </form>
      </div>
    </div>
  );
}
