import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Fonte local — sem dependência de rede externa no build/dev
const inter = localFont({
  src: [
    { path: '../public/fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Inter-Medium.woff2',  weight: '500', style: 'normal' },
    { path: '../public/fonts/Inter-SemiBold.woff2',weight: '600', style: 'normal' },
    { path: '../public/fonts/Inter-Bold.woff2',    weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
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
