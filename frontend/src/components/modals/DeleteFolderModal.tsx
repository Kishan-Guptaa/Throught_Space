"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import api from "@/lib/axios";

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  folder: { _id: string; name: string } | null;
}

export default function DeleteFolderModal({ isOpen, onClose, onSuccess, folder }: DeleteFolderModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !folder || !mounted) return null;

  const requiredText = `delete-${folder.name}`;
  const isMatch = confirmText === requiredText;

  const handleDelete = async () => {
    if (!isMatch) return;
    setIsLoading(true);
    try {
      await api.delete(`/folders/${folder._id}`);
      onSuccess();
      onClose();
      setConfirmText("");
    } catch (error) {
      console.error("Failed to delete folder", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111111] w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative border border-gray-200 dark:border-gray-800">
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-900 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-red-100 dark:bg-red-500/10 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">Delete Folder</h2>
          <p className="text-sm text-gray-500 font-medium mt-2">
            This action cannot be undone. This will permanently delete the folder 
            <span className="font-bold text-gray-900 dark:text-gray-100"> {folder.name}</span>.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Type <span className="font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded">{requiredText}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleClose}
              className="flex-1 py-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading || !isMatch}
              className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
