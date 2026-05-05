import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import React from 'react'
import { Trash2 } from 'lucide-react'

export default function CalloutComponent({ deleteNode }: any) {
  return (
    <NodeViewWrapper className="callout-wrapper relative my-8 group">
      <div className="absolute -top-3 -right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.preventDefault(); deleteNode(); }}
          className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all active:scale-95 border border-red-400/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="flex items-start gap-4 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 bg-gray-50/50 dark:bg-gray-900/20 hover:border-gray-200 dark:hover:border-gray-700 transition-all">
        <div className="flex-shrink-0 text-2xl pt-1">
          💡
        </div>
        <div className="flex-1 min-w-0">
          <NodeViewContent className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic" />
        </div>
      </div>
    </NodeViewWrapper>
  )
}
