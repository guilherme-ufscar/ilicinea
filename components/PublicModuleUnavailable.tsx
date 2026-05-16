import Link from 'next/link'

interface PublicModuleUnavailableProps {
  title: string
  description: string
  backHref?: string
  backLabel?: string
}

export default function PublicModuleUnavailable({
  title,
  description,
  backHref = '/',
  backLabel = 'Voltar ao início',
}: PublicModuleUnavailableProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="card p-8 text-center">
        <h1 className="text-2xl font-bold text-text mb-3">{title}</h1>
        <p className="text-text-soft mb-6">{description}</p>
        <Link href={backHref} className="btn-primary inline-flex items-center justify-center px-5 py-3">
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
