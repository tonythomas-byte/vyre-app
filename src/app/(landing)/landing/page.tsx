'use client'

import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import LandingBackground from './LandingBackground'
import HeroWithArchNavigation from './HeroWithArchNavigation'
import JournalModule from './JournalModule'
import DailyTaskModule from './DailyTaskModule'
import DailyQuoteModule from './DailyQuoteModule'
import FooterNav from '@/components/FooterNav'
import DecorativeFloras from './DecorativeFloras'
import styles from './landing.module.css'

export default function LandingPage() {
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
    <LandingBackground>
      <PageBackground>
        <div className={styles.pageContainer}>
          {/* Decorative Floras Layer - Non-interactive visual enhancements */}
          <DecorativeFloras />
          
          {/* Hero section with arch and navigation - single semantic unit */}
          <HeroWithArchNavigation
            userName="there"
            userAvatar="/assets/images/landing/Zen_character.png"
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
    </LandingBackground>
  )
}