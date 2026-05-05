"use client";

import { useState, useRef } from "react";
import { X, Camera, Loader2, Twitter, Github, Linkedin, Instagram, Upload } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, login } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState((user as any)?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [socialLinks, setSocialLinks] = useState({
    twitter: (user as any)?.socialLinks?.twitter || "",
    github: (user as any)?.socialLinks?.github || "",
    linkedin: (user as any)?.socialLinks?.linkedin || "",
    instagram: (user as any)?.socialLinks?.instagram || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.put("/auth/profile", { 
        name, 
        username, 
        bio, 
        profileImage,
        socialLinks 
      });
      login(response.data.user);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111111] w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#111111] px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Avatar Update */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden border-4 border-gray-50 dark:border-gray-800 shadow-xl">
                {isUploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <img 
                    src={profileImage || `https://ui-avatars.com/api/?name=${name}&background=000&color=fff&size=256&bold=true`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-[#111111]"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            
            <div className="w-full space-y-2">
               <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Profile Image Source</label>
               <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="URL or Uploaded Preview..." 
                    value={profileImage.startsWith('data:') ? 'Local Image Selected' : profileImage}
                    readOnly={profileImage.startsWith('data:')}
                    onChange={(e) => setProfileImage(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-4 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold"
                  />
                  {profileImage.startsWith('data:') && (
                    <button 
                      type="button"
                      onClick={() => setProfileImage("")}
                      className="p-4 bg-gray-100 dark:bg-gray-800 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
                      title="Remove local image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
               </div>
               <p className="text-[10px] text-gray-400 font-bold ml-1 italic">Click the camera icon to upload from your computer.</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl pl-10 pr-6 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-bold"
                  placeholder="unique_username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl px-6 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-medium resize-none"
                placeholder="Tell the world about yourself..."
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Social Profiles</h3>
            
            <div className="space-y-4">
              <div className="relative group">
                <Twitter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input 
                  type="text" 
                  value={socialLinks.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all font-bold"
                  placeholder="Twitter URL (e.g., https://twitter.com/username)"
                />
              </div>

              <div className="relative group">
                <Github className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900 dark:text-white" />
                <input 
                  type="text" 
                  value={socialLinks.github}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-4 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all font-bold"
                  placeholder="GitHub URL"
                />
              </div>

              <div className="relative group">
                <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-700" />
                <input 
                  type="text" 
                  value={socialLinks.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 transition-all font-bold"
                  placeholder="LinkedIn URL"
                />
              </div>

              <div className="relative group">
                <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                <input 
                  type="text" 
                  value={socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-4 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all font-bold"
                  placeholder="Instagram URL"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white dark:bg-[#111111] py-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-gray-100 dark:bg-gray-900 text-gray-500 rounded-3xl font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 px-8 py-4 bg-gray-900 text-white dark:bg-white dark:text-black rounded-3xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
