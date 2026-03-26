'use client'

import PageBackground from '@/components/PageBackground'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PageBackground>
      {children}
    </PageBackground>
  )
}
