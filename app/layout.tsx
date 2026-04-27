import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Ilicínea.com — Portal Local de Ilicínea/MG',
    template: '%s | Ilicínea.com',
  },
  description:
    'Portal local de Ilicínea/MG. Encontre comércios, imóveis, notícias e pontos turísticos da cidade.',
  keywords: ['Ilicínea', 'Minas Gerais', 'comércios', 'imóveis', 'notícias', 'turismo'],
  authors: [{ name: 'Ilicínea.com' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Ilicínea.com',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
