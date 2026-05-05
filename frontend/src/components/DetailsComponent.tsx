import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import React from 'react'
import { Trash2, ChevronDown } from 'lucide-react'

export default function DetailsComponent({ node, deleteNode }: any) {
  return (
    <NodeViewWrapper className="details-wrapper relative my-8 group">
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.preventDefault();
            deleteNode();
          }}
          className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all active:scale-95 border border-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 bg-gray-50/50 dark:bg-gray-900/20 hover:border-gray-200 dark:hover:border-gray-700 transition-all">
        <div className="flex items-center gap-3 mb-6 text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
          <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <ChevronDown className="w-3 h-3" />
          </div>
          <span>Collapsible Details</span>
        </div>
        
        <div className="details-summary-container mb-4">
           <NodeViewContent name="details-summary" className="text-2xl font-black text-gray-900 dark:text-gray-100 placeholder:text-gray-300" />
        </div>
        
        <div className="details-content-container pt-4 border-t border-gray-100 dark:border-gray-800">
           <NodeViewContent name="details-content" className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed" />
        </div>
      </div>
    </NodeViewWrapper>
  )
}
