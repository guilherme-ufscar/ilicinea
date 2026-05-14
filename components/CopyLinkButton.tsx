'use client'

interface CopyLinkButtonProps {
  url: string
  className?: string
  children: React.ReactNode
}

export default function CopyLinkButton({ url, className, children }: CopyLinkButtonProps) {
  async function handleClick() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
