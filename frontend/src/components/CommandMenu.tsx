"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Minus, 
  Link as LinkIcon, 
  Code, 
  Quote, 
  ChevronDown, 
  Megaphone, 
  Table as TableIcon, 
  Box, 
  Sigma, 
  FileCode, 
  Image as ImageIcon, 
  AtSign, 
  Sparkles, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
}

const commands: CommandItem[] = [
  // Basic
  { id: 'text', title: 'Text', description: 'Start writing with plain text', icon: Type, category: 'Basic' },
  { id: 'h1', title: 'Heading 1', description: 'Big heading', icon: Heading1, category: 'Basic' },
  { id: 'h2', title: 'Heading 2', description: 'Medium heading', icon: Heading2, category: 'Basic' },
  { id: 'h3', title: 'Heading 3', description: 'Small heading', icon: Heading3, category: 'Basic' },
  { id: 'bullet', title: 'Bullet List', description: 'Create a simple bullet list', icon: List, category: 'Basic' },
  { id: 'ordered', title: 'Numbered List', description: 'Create a numbered list', icon: ListOrdered, category: 'Basic' },
  { id: 'divider', title: 'Divider', description: 'Insert a dividing line', icon: Minus, category: 'Basic' },
  { id: 'link', title: 'Link', description: 'Insert a hyperlink', icon: LinkIcon, category: 'Basic' },
  
  // Advanced
  { id: 'code', title: 'Code Block', description: 'Add a code block', icon: Code, category: 'Advanced' },
  { id: 'quote', title: 'Quote', description: 'Add a blockquote', icon: Quote, category: 'Advanced' },
  { id: 'details', title: 'Details', description: 'Add a collapsible details block', icon: ChevronDown, category: 'Advanced' },
  { id: 'callout', title: 'Callout', description: 'Add a callout block', icon: Megaphone, category: 'Advanced' },
  { id: 'html', title: 'HTML', description: 'Insert custom HTML (Experimental)', icon: FileCode, category: 'Advanced' },
  
  // Media
  { id: 'image', title: 'Image', description: 'Upload an image', icon: ImageIcon, category: 'Media' },
  { id: 'mention', title: 'Mention', description: 'Mention someone in this article', icon: AtSign, category: 'Media' },
  
  // AI
  { id: 'outline', title: 'Generate Outline', description: 'Create an article outline with AI', icon: Sparkles, category: 'AI' },
  { id: 'summarize', title: 'Summarize', description: 'Summarize this article with AI', icon: FileText, category: 'AI' },
];

const categories = ['Basic', 'Advanced', 'Media', 'AI', 'Embeds'];

export default function CommandMenu({ onSelect, onClose }: { onSelect: (id: string) => void, onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState('Basic');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredCommands = commands.filter(c => c.category === activeCategory);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(filteredCommands[selectedIndex].id);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, onSelect, onClose]);

  return (
    <div className="w-[320px] bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
      {/* Categories Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-gray-900 overflow-x-auto no-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSelectedIndex(0); }}
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap",
              activeCategory === cat 
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Commands List */}
      <div ref={scrollRef} className="max-h-[300px] overflow-y-auto p-1 py-2">
        <div className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
          {activeCategory}
        </div>
        {filteredCommands.map((cmd, idx) => (
          <button
            key={cmd.id}
            onClick={() => onSelect(cmd.id)}
            onMouseEnter={() => setSelectedIndex(idx)}
            className={cn(
              "w-full flex items-center gap-3 p-2 px-3 rounded-xl transition-all text-left group",
              selectedIndex === idx 
                ? "bg-gray-100 dark:bg-gray-800" 
                : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-colors",
              selectedIndex === idx ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" : ""
            )}>
              <cmd.icon className="w-4 h-4 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{cmd.title}</div>
              <div className="text-[11px] text-gray-400 font-medium leading-none">{cmd.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
