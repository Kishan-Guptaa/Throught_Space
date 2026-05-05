import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import React from 'react'
import { Trash2 } from 'lucide-react'

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
];

export default function CodeBlockComponent({ node, updateAttributes, deleteNode }: any) {
  return (
    <NodeViewWrapper className="relative group my-8">
      <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-2">
        <select 
          contentEditable={false}
          defaultValue={node.attrs.language || 'javascript'} 
          onChange={event => updateAttributes({ language: event.target.value })}
          className="bg-gray-900 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-full px-4 py-2 outline-none border border-gray-800 hover:bg-black focus:border-gray-600 transition-all cursor-pointer shadow-xl"
        >
          <option value="null">auto</option>
          {languages.map((lang, index) => (
            <option key={index} value={lang.value}>{lang.label}</option>
          ))}
        </select>
        <button 
          onClick={(e) => { e.preventDefault(); deleteNode(); }}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-xl transition-all active:scale-95 border border-red-400/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <pre className="!mt-0 !mb-0 rounded-[2rem] bg-[#0d0d0d] border border-gray-800/50 p-8 overflow-x-auto shadow-2xl">
        <NodeViewContent as="code" className={node.attrs.language ? `language-${node.attrs.language}` : ''} />
      </pre>
    </NodeViewWrapper>
  )
}
