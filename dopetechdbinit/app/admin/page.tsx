"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main admin panel
    router.push('/doptechadmin')
  }, [router])

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#F7DD0F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#F7DD0F] font-semibold">Redirecting to Admin Panel...</p>
      </div>
    </div>
  )
}
