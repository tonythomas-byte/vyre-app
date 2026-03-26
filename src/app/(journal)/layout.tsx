'use client'

import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import FooterNav from '@/components/FooterNav'

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleFooterNavigation = (destination: 'groups' | 'menu' | 'profile' | 'explore' | 'account') => {
    switch (destination) {
      case 'groups':
        router.push('/groups')
        break
      case 'menu':
        router.push('/menu')
        break
      case 'profile':
        router.push('/profile')
        break
      case 'explore':
        router.push('/explore')
        break
      case 'account':
        router.push('/account')
        break
    }
  }

  return (
    <PageBackground>
      {children}
      <footer style={{ width: '100%', maxWidth: '400px', marginTop: 'auto', paddingTop: 'clamp(1rem, 3vw, 2rem)' }}>
        <FooterNav onNavigate={handleFooterNavigation} />
      </footer>
    </PageBackground>
  )
}
