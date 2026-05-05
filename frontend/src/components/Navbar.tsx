"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PenTool, Search, Bell, Moon, Sun, LogOut, Menu, X, User } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import NotificationsModal from "@/components/modals/NotificationsModal";
import { motion, AnimatePresence } from "framer-motion";


const navLinks = [
  { name: "Explore", href: "/" },
  { name: "Bookmarks", href: "/bookmarks" },
  { name: "Write", href: "/write" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const res = await api.get("/social/notifications");
          const unread = res.data.notifications.filter((n: any) => !n.read).length;
          setUnreadCount(unread);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-[#FAFAFA]/80 dark:bg-[#111111]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tighter flex items-center gap-1.5 font-sans">
                Thought<span className="text-gray-400">Space</span>
                <PenTool className="w-5 h-5 text-gray-900 dark:text-gray-100 rotate-12" />
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-bold transition-colors font-sans",
                    pathname === link.href
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Search - Hidden on small mobile */}
            <div className="hidden lg:block relative w-64 xl:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search users..."
                onChange={async (e) => {
                  const query = e.target.value;
                  if (query.length > 1) {
                    const res = await api.get(`/auth/search?query=${query}`);
                    setSearchResults(res.data.users);
                  } else {
                    setSearchResults([]);
                  }
                }}
                className="w-full bg-gray-200 dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-800 rounded-full py-2 pl-10 pr-16 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-gray-100 font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border dark:border-gray-700 px-1.5 py-0.5 rounded text-[8px] font-black text-gray-400 uppercase">
                Ctrl K
              </div>

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0D0D0D] border-2 border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-2">
                    {searchResults.map((u: any) => (
                      <Link href={`/profile/${u.username}`} key={u._id} onClick={() => setSearchResults([])}>
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-2xl transition-all">
                          <img src={u.profileImage || `https://ui-avatars.com/api/?name=${u.name}&background=ffffff&color=000&bold=true`} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="text-xs font-black text-gray-900 dark:text-gray-100 mb-0.5">{u.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold">@{u.username}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <button onClick={toggleTheme} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-all">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-all active:scale-90"
                >
                  <Bell className={cn("w-5 h-5 transition-colors", isNotificationsOpen ? "text-blue-600" : "text-gray-500 dark:text-gray-400")} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-2 bg-rose-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <NotificationsModal 
                  isOpen={isNotificationsOpen} 
                  onClose={() => {
                    setIsNotificationsOpen(false);
                    setUnreadCount(0);
                  }} 
                />
              </div>

              {/* Mobile Menu Trigger */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                <Link href="/profile" className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 overflow-hidden hover:scale-110 transition-transform">
                   <img src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=ffffff&color=000&bold=true`} alt="Profile" />
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors p-2" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0D0D0D] overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
               {/* Mobile Search */}
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search people..."
                    onChange={async (e) => {
                      const query = e.target.value;
                      if (query.length > 1) {
                        const res = await api.get(`/auth/search?query=${query}`);
                        setSearchResults(res.data.users);
                      } else {
                        setSearchResults([]);
                      }
                    }}
                    className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-gray-900 dark:text-gray-100"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0D0D0D] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50">
                      {searchResults.map((u: any) => (
                        <Link href={`/profile/${u.username}`} key={u._id} onClick={() => setSearchResults([])}>
                          <div className="flex items-center gap-3 p-3 border-b border-gray-50 dark:border-gray-900 last:border-none">
                            <img src={u.profileImage || `https://ui-avatars.com/api/?name=${u.name}&background=ffffff&color=000&bold=true`} className="w-8 h-8 rounded-full" />
                            <p className="text-xs font-bold">{u.name}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-1 gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl text-base font-black uppercase tracking-[0.2em]",
                        pathname === link.href
                          ? "bg-blue-600 text-white"
                          : "bg-gray-50 dark:bg-gray-900 text-gray-500"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
               </div>

               <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <Link href="/profile" className="flex items-center gap-3">
                    <img 
                      src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=ffffff&color=000&bold=true`} 
                      className="w-10 h-10 rounded-full border-2 border-gray-100 dark:border-gray-800" 
                    />
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{user?.name}</p>
                      <p className="text-[10px] font-bold text-gray-400">View Profile</p>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                    <LogOut className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
