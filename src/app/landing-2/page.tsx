'use client'

import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import Landing2Background from '@/components/Landing2Background'
import HeroWithArchNavigation from '@/components/HeroWithArchNavigation'
import JournalModule from '@/components/JournalModule'
import DailyTaskModule from '@/components/DailyTaskModule'
import DailyQuoteModule from '@/components/DailyQuoteModule'
import FooterNav from '@/components/FooterNav'
import DecorativeFloras from '@/components/DecorativeFloras'
import styles from './landing-2.module.css'

export default function Landing2() {
  const router = useRouter()

  const handleNavigation = (destination: 'treasure' | 'journal' | 'calendar') => {
    // Handle navigation based on destination
    switch (destination) {
      case 'treasure':
        router.push('/treasure-pill')
        break
      case 'journal':
        router.push('/journal')
        break
      case 'calendar':
        router.push('/calendar')
        break
    }
  }

  const handleFooterNavigation = (destination: 'groups' | 'menu' | 'profile' | 'explore' | 'account') => {
    // Handle footer navigation based on destination
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
    <Landing2Background>
      <PageBackground>
        <div className={styles.pageContainer}>
          {/* Decorative Floras Layer - Non-interactive visual enhancements */}
          <DecorativeFloras />
          
          {/* Hero section with arch and navigation - single semantic unit */}
          <HeroWithArchNavigation
            userName="there"
            userAvatar="/assets/landing-2/Zen_character.png"
            onNavigate={handleNavigation}
          />
          
          {/* Content section - flows naturally after hero */}
          <main className={styles.contentSection}>
            <JournalModule />
            <DailyTaskModule />
            <DailyQuoteModule />
          </main>
          
          {/* Footer section - naturally positioned at end of content flow */}
          <footer className={styles.footerSection}>
            <FooterNav onNavigate={handleFooterNavigation} />
          </footer>
        </div>
      </PageBackground>
    </Landing2Background>
  )
}