import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <div className="py-6 px-4 flex justify-center">
        <Link href="/">
          <Image src="/ilicinea-logo.svg" alt="Ilicínea.com" width={140} height={36} className="h-9 w-auto" />
        </Link>
      </div>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-[#888888]">
        © {new Date().getFullYear()} Ilicínea.com
      </footer>
    </div>
  )
}
