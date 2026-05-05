import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import CalloutComponent from './CalloutComponent'

export const CalloutExtension = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  draggable: true,
  
  parseHTML() {
    return [
      { tag: 'div[data-type="callout"]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent)
  },

  addCommands() {
    return {
      setCallout: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Type your callout message here...',
                },
              ],
            },
          ],
        })
      },
    }
  },
})
