'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import EditorToolbar from './EditorToolbar'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  enableImageUpload?: boolean
  minHeight?: string
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Escreva aqui...',
  enableImageUpload = false,
  minHeight = '300px',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      ...(enableImageUpload
        ? [Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full' } })]
        : []),
      Youtube.configure({ controls: false }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none p-4',
        style: `min-height: ${minHeight}`,
      },
    },
  })

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} enableImageUpload={enableImageUpload} />
      <EditorContent editor={editor} />
    </div>
  )
}
