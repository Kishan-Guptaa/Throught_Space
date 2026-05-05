import { NodeViewWrapper } from '@tiptap/react'
import React, { useState, useEffect } from 'react'
import { Terminal, Eye, Code, Trash2 } from 'lucide-react'

export default function HTMLComponent({ node, updateAttributes, deleteNode }: any) {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateAttributes({ html: e.target.value })
  }

  return (
    <NodeViewWrapper className="html-compiler-wrapper relative my-10 group">
      <div className="absolute -top-3 -right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={deleteNode}
          className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden bg-white dark:bg-[#0D0D0D] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-3 h-3" />
              HTML Compiler
            </span>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'code' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-400'}`}
            >
              <Code className="w-3 h-3" />
              Editor
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-400'}`}
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="relative min-h-[200px]">
          {activeTab === 'code' ? (
            <textarea
              value={node.attrs.html}
              onChange={handleCodeChange}
              placeholder="Paste or write your HTML here..."
              className="w-full h-[300px] p-6 bg-transparent text-gray-700 dark:text-gray-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
            />
          ) : (
            <div className="p-6 bg-white dark:bg-white min-h-[300px]">
               <div dangerouslySetInnerHTML={{ __html: node.attrs.html || '<p class="text-gray-400 italic">No HTML to preview...</p>' }} />
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  )
}
