"use client";

import Link from "next/link";
import { PenTool, Twitter, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Explore", href: "/" },
        { name: "Trending", href: "/" },
        { name: "Write", href: "/write" },
        { name: "Bookmarks", href: "/bookmarks" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Guidelines", href: "/guidelines" },
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
      ],

    },
  ];

  return (
    <footer className="w-full bg-[#FAFAFA] dark:bg-[#111111] border-t border-gray-200 dark:border-gray-800 pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tighter flex items-center gap-1.5 font-sans">
                Thought<span className="text-gray-400">Space</span>
                <PenTool className="w-5 h-5 text-gray-900 dark:text-gray-100 rotate-12 group-hover:rotate-0 transition-transform duration-300" />
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm font-medium leading-relaxed font-sans">
              A premium, folder-based sanctuary for your thoughts. Organize your knowledge, share your insights, and inspire a global community of writers.
            </p>
            <div className="pt-2">
              <a 
                href="https://kishann.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                Crafted with passion by <span className="bg-blue-600 text-white px-2 py-0.5 rounded">Kishan</span>
              </a>
            </div>
            <div className="flex items-center gap-4">

              <a href="https://x.com/T2_c0de" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-blue-500 hover:scale-110 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com/Kishan-Guptaa" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white hover:scale-110 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/kishangupta09/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-blue-700 hover:scale-110 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>

            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center group gap-1"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            © {currentYear} ThoughtSpace Platform. Built for the modern writer.
          </p>
          <div className="flex items-center gap-6">
             <Link href="/" className="text-[11px] font-black text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors">
               Status
             </Link>
             <Link href="/contact" className="text-[11px] font-black text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors">
               Contact
             </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}
