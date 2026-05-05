import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'
import { Trash2 } from 'lucide-react'

export default function ImageComponent({ node, deleteNode }: any) {
  return (
    <NodeViewWrapper className="relative group my-8">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button 
          onClick={(e) => { e.preventDefault(); deleteNode(); }}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-xl transition-all active:scale-95 border border-red-400/20"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <img 
        src={node.attrs.src} 
        alt={node.attrs.alt} 
        className="w-full rounded-3xl border-2 border-gray-100 dark:border-gray-800 shadow-2xl"
      />
    </NodeViewWrapper>
  )
}
