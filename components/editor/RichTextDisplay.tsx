import DOMPurify from 'isomorphic-dompurify'

interface Props {
  html: string
  className?: string
}

export default function RichTextDisplay({ html, className }: Props) {
  const clean = DOMPurify.sanitize(html)
  return (
    <div
      className={`prose prose-lg max-w-none
        prose-headings:text-text prose-headings:font-bold
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-lg prose-img:shadow-md
        prose-blockquote:border-l-primary prose-blockquote:text-text-soft
        ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
