'use client'

import { useCallback, useState, useRef } from 'react'
import type { Editor } from '@tiptap/react'

interface Props {
  editor: Editor | null
  enableImageUpload: boolean
}

export default function EditorToolbar({ editor, enableImageUpload }: Props) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!editor) return null

  const btnClass = (active: boolean) =>
    `px-2 py-1.5 rounded text-sm font-medium transition-colors ${
      active ? 'bg-primary text-white' : 'text-text-soft hover:bg-surface-soft hover:text-text'
    }`

  const setLink = useCallback(() => {
    if (!linkUrl) return
    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    setShowLinkInput(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB.')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'editor')

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      editor.chain().focus().setImage({ src: url, alt: file.name }).run()
    } catch {
      alert('Erro ao fazer upload da imagem.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const addYoutube = () => {
    const url = prompt('URL do vídeo do YouTube:')
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }

  return (
    <div className="border-b border-border bg-surface-soft px-3 py-2 flex flex-wrap items-center gap-1">
      {/* Text formatting */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Negrito">
        <strong>B</strong>
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Itálico">
        <em>I</em>
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="Sublinhado">
        <u>U</u>
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))} title="Tachado">
        <s>S</s>
      </button>

      <span className="w-px h-5 bg-border mx-1" />

      {/* Headings */}
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} title="Título 1">
        H1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Título 2">
        H2
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))} title="Título 3">
        H3
      </button>

      <span className="w-px h-5 bg-border mx-1" />

      {/* Lists */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Lista">
        •≡
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Lista numerada">
        1.
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} title="Citação">
        &quot;
      </button>

      <span className="w-px h-5 bg-border mx-1" />

      {/* Alignment */}
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Alinhar esquerda">
        ⇤
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Centralizar">
        ⇔
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="Alinhar direita">
        ⇥
      </button>

      {enableImageUpload && (
        <>
          <span className="w-px h-5 bg-border mx-1" />

          {/* Image upload */}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className={btnClass(false)} title="Inserir imagem">
            {uploading ? '...' : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="m21 16-5-5-8 8" /></svg>}
          </button>

          {/* YouTube */}
          <button onClick={addYoutube} className={btnClass(false)} title="Inserir vídeo YouTube">
            ▶
          </button>
        </>
      )}

      <span className="w-px h-5 bg-border mx-1" />

      {/* Link */}
      {showLinkInput ? (
        <div className="flex items-center gap-1">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="w-32 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            onKeyDown={(e) => e.key === 'Enter' && setLink()}
          />
          <button onClick={setLink} className="text-xs bg-primary text-white px-2 py-1 rounded">OK</button>
          <button onClick={() => setShowLinkInput(false)} className="text-xs text-text-muted"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>
        </div>
      ) : (
        <button onClick={() => setShowLinkInput(true)} className={btnClass(editor.isActive('link'))} title="Inserir link">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L11 5" /><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 19" /></svg>
        </button>
      )}

      <span className="w-px h-5 bg-border mx-1" />

      {/* Undo/Redo */}
      <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} title="Desfazer">↩</button>
      <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} title="Refazer">↪</button>
      <button onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} className={btnClass(false)} title="Limpar formatação">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8Z" /><path d="M5 18h.01" /><path d="M19 5h.01" /><path d="M19 19h.01" /></svg>
      </button>
    </div>
  )
}
