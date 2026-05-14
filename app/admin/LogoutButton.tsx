'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await signOut({ callbackUrl: '/' })
      }}
    >
      <button
        type="submit"
        className="w-full px-3 py-2 text-sm text-text-soft hover:bg-accent-light hover:text-accent rounded-lg transition-colors text-left"
      >
        Sair
      </button>
    </form>
  )
}
