"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";
import { 
  Home, 
  PenTool, 
  Bookmark, 
  Bell, 
  User, 
  Folder, 
  Moon, 
  Sun,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Write", href: "/write", icon: PenTool },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Notifications", href: "/notifications", icon: Bell, count: 3 },
  { name: "Profile", href: "/profile", icon: User },
];

const folders = [
  { name: "JavaScript", count: 12, color: "bg-gray-300" },
  { name: "System Design", count: 8, color: "bg-gray-500" },
  { name: "React", count: 10, color: "bg-gray-400" },
  { name: "Node.js", count: 9, color: "bg-gray-600" },
  { name: "Database", count: 7, color: "bg-gray-200" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-50 dark:bg-[#0B0E14] border-r border-gray-200 dark:border-gray-800 flex flex-col p-6 z-50 overflow-y-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10">
        <span className="text-2xl font-black text-black dark:text-white tracking-tighter flex items-center gap-1">
          Blog<span className="text-gray-400">Nest</span>
          <PenTool className="w-5 h-5 text-black dark:text-white rotate-12" />
        </span>
      </Link>

      {/* Main Nav */}
      <nav className="space-y-1 mb-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-black text-white dark:bg-white dark:text-black font-bold" 
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5", isActive ? "text-white dark:text-black" : "text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white")} />
                <span className="font-semibold text-sm">{item.name}</span>
              </div>
              {item.count && (
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", isActive ? "bg-white text-black dark:bg-black dark:text-white" : "bg-gray-200 text-gray-600 dark:bg-white dark:text-black")}>
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Folders */}
      <div className="mb-10">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 px-4">Folders</h4>
        <div className="space-y-1">
          {folders.map((folder) => (
            <Link
              key={folder.name}
              href={`/folder/${folder.name.toLowerCase()}`}
              className="flex items-center justify-between px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-all text-sm group"
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-sm", folder.color)} />
                <span className="font-medium">{folder.name}</span>
              </div>
              <span className="text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 text-xs font-bold">{folder.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quote Card */}
      <div className="mt-auto bg-gray-100 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 mb-6">
        <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed">
          "The beautiful thing about learning is that no one can take it away from you."
        </p>
        <span className="text-[10px] text-gray-500 dark:text-gray-600 mt-2 block font-bold">— B.B. King</span>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center justify-between px-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dark Mode</span>
        <button 
          onClick={toggleTheme}
          className="w-10 h-5 bg-gray-300 dark:bg-gray-800 rounded-full relative transition-colors duration-300"
        >
          <div className={cn(
            "absolute top-1 w-3 h-3 rounded-full transition-all duration-300 flex items-center justify-center",
            theme === 'dark' ? "left-6 bg-white" : "left-1 bg-gray-400"
          )}>
          </div>
        </button>
      </div>
    </aside>
  );
}
