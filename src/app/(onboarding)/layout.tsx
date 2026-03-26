'use client'

import PageBackground from '@/components/PageBackground'

export default function OnboardingLayout({
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
