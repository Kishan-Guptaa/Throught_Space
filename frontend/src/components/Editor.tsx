"use client";

import { useState, useRef } from "react";
import { useEditor, EditorContent, ReactNodeViewRenderer, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import 'highlight.js/styles/vs2015.css';
import { 
  Bold, 
  Italic, 
  List, 
  Quote, 
  Heading1, 
  Heading2,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CommandMenu from './CommandMenu';
import CodeBlockComponent from './CodeBlockComponent';

const lowlight = createLowlight(common);

import Details from '@tiptap/extension-details';
import DetailsSummary from '@tiptap/extension-details-summary';
import DetailsContent from '@tiptap/extension-details-content';
import DetailsComponent from './DetailsComponent';
import { CalloutExtension } from './CalloutExtension';
import { HTMLExtension } from './HTMLExtension';
import ImageComponent from './ImageComponent';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuButton = ({ onClick, isActive, children }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "p-2 rounded-lg transition-all",
      isActive 
        ? "bg-gray-900 text-gray-100 dark:bg-gray-100 dark:text-gray-900" 
        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
    )}
  >
    {children}
  </button>
);

export default function Editor({ content, onChange }: EditorProps) {
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ImageComponent)
        },
      }).configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-3xl border-2 border-gray-100 dark:border-gray-800 shadow-xl my-8',
        },
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent)
        },
      }).configure({ lowlight }),
      Details.extend({
        addNodeView() {
          return ReactNodeViewRenderer(DetailsComponent)
        },
        addKeyboardShortcuts() {
          return {
            // Shift-Enter to "back out" of the details block and work in the main page
            'Shift-Enter': () => {
              if (this.editor.isActive('details')) {
                const { state } = this.editor;
                const { $from } = state.selection;
                
                // Find the parent details node's end position
                let detailsEndPos = -1;
                state.doc.nodesBetween($from.before(1), state.doc.content.size, (node, pos) => {
                  if (node.type.name === 'details' && pos <= $from.pos && (pos + node.nodeSize) >= $from.pos) {
                    detailsEndPos = pos + node.nodeSize;
                    return false;
                  }
                });

                if (detailsEndPos !== -1) {
                  return this.editor.chain()
                    .insertContentAt(detailsEndPos, { type: 'paragraph' })
                    .focus(detailsEndPos + 1)
                    .run();
                }
              }
              return false;
            },
          }
        }
      }),
      DetailsSummary,
      DetailsContent,
      CalloutExtension,
      HTMLExtension,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === '/') {
          const { top, left } = view.coordsAtPos(view.state.selection.from);
          if (editorRef.current) {
            const editorBounds = editorRef.current.getBoundingClientRect();
            setMenuCoords({ 
              top: top - editorBounds.top + 30, 
              left: left - editorBounds.left 
            });
          }
          setShowCommandMenu(true);
        } else if (event.key === 'Escape' || event.key === ' ') {
          setShowCommandMenu(false);
        }
        return false;
      },
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] font-sans text-gray-700 dark:text-gray-300',
      },
    },
  });

  const handleCommandSelect = (id: string) => {
    if (!editor) return;
    
    // Remove the '/'
    editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
    
    // Execute command
    if (id === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
    if (id === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
    if (id === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
    if (id === 'bullet') editor.chain().focus().toggleBulletList().run();
    if (id === 'ordered') editor.chain().focus().toggleOrderedList().run();
    if (id === 'quote') editor.chain().focus().toggleBlockquote().run();
    if (id === 'code') editor.chain().focus().toggleCodeBlock().run();
    if (id === 'divider') editor.chain().focus().setHorizontalRule().run();
    if (id === 'details') editor.chain().focus().setDetails().run();
    if (id === 'callout') editor.commands.setCallout();
    if (id === 'html') editor.commands.setHTMLCompiler();
    if (id === 'image') imageInputRef.current?.click();
    
    setShowCommandMenu(false);
  };

  if (!editor) return null;

  return (
    <div className="w-full relative" ref={editorRef}>
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />
      {/* Subtle Toolbar */}
      <div className="flex flex-wrap items-center gap-1 mb-8 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-800 mx-2" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-800 mx-2" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        >
          <Quote className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Command Menu */}
      {showCommandMenu && (
        <div 
          className="absolute z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ top: menuCoords.top, left: menuCoords.left }}
        >
          <CommandMenu 
            onSelect={handleCommandSelect} 
            onClose={() => setShowCommandMenu(false)} 
          />
        </div>
      )}

      {/* Canvas */}
      <div className="relative">
        {editor.isEmpty && (
          <div className="absolute top-0 left-0 text-gray-300 dark:text-gray-700 pointer-events-none text-xl font-medium">
            Type '/' for commands...
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
