import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const protectedRoutes = ['/minha-empresa', '/meus-imoveis', '/admin']
const adminRoutes = ['/admin']
const authRoutes = ['/entrar', '/criar-conta', '/recuperar-senha']

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })
  const isLoggedIn = !!token?.sub

  const isAdminRoute = adminRoutes.some((r) => nextUrl.pathname.startsWith(r))
  const isProtectedRoute = protectedRoutes.some((r) => nextUrl.pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => nextUrl.pathname.startsWith(r))

  if (isAdminRoute && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/entrar', nextUrl))
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/entrar', nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
}
