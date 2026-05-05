import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import HTMLComponent from './HTMLComponent'

export const HTMLExtension = Node.create({
  name: 'htmlCompiler',
  group: 'block',
  atom: true,
  
  addAttributes() {
    return {
      html: {
        default: '<h1>Hello World</h1>\n<p>Start writing your custom HTML here!</p>',
      },
    }
  },

  parseHTML() {
    return [
      { tag: 'div[data-type="html-compiler"]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'html-compiler' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(HTMLComponent)
  },

  addCommands() {
    return {
      setHTMLCompiler: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            html: '<h1>Hello World</h1>\n<p>Start writing your custom HTML here!</p>'
          }
        })
      },
    }
  },
})
