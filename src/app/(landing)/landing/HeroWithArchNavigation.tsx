'use client'

import Image from 'next/image'
import styles from './HeroWithArchNavigation.module.css'

interface HeroWithArchNavigationProps {
  userName?: string
  userAvatar: string
  onNavigate?: (destination: 'treasure' | 'journal' | 'calendar') => void
}

export default function HeroWithArchNavigation({ 
  userName = 'there',
  userAvatar,
  onNavigate 
}: HeroWithArchNavigationProps) {
  const handleNavigation = (destination: 'treasure' | 'journal' | 'calendar') => {
    if (onNavigate) {
      onNavigate(destination)
    }
  }

  return (
    <section className={styles.heroSection}>
      <div className={styles.archContainer}>
        {/* Lavender gradient arch background - fills entire inside area */}
        <div className={styles.archBackground} aria-hidden="true"></div>
        
        {/* Hero content inside the arch */}
        <div className={styles.heroContent}>
          {/* Avatar and greeting positioned inside arch */}
          <div className={styles.avatarWrapper}>
            <Image
              src={userAvatar}
              alt="Your zen avatar"
              width={180}
              height={180}
              className={styles.avatarImage}
              priority
            />
            {/* Greeting bubble positioned at top-right of avatar */}
            <div className={styles.greetingBubble}>
              <p className={styles.greeting}>Hi, Good morning</p>
            </div>
          </div>
        </div>
        
        {/* Navigation icons straddling the arch curve */}
        <nav className={styles.archNavigation} aria-label="Main navigation">
          <button 
            className={`${styles.navButton} ${styles.treasureButton}`}
            onClick={() => handleNavigation('treasure')}
            aria-label="Treasure"
          >
            <Image
              src="/assets/nav%20icons/treasure.png"
              alt=""
              width={22}
              height={22}
              className={styles.navIcon}
            />
            <span className={styles.navLabel}>Treasure</span>
          </button>
          
          <button 
            className={`${styles.navButton} ${styles.centerButton} ${styles.journalButton}`}
            onClick={() => handleNavigation('journal')}
            aria-label="Journal"
          >
            <Image
              src="/assets/nav%20icons/journal.png"
              alt=""
              width={26}
              height={26}
              className={styles.navIcon}
            />
            <span className={styles.navLabel}>Journal</span>
          </button>
          
          <button 
            className={`${styles.navButton} ${styles.calendarButton}`}
            onClick={() => handleNavigation('calendar')}
            aria-label="Calendar"
          >
            <Image
              src="/assets/nav%20icons/calender.png"
              alt=""
              width={22}
              height={22}
              className={styles.navIcon}
            />
            <span className={styles.navLabel}>Calendar</span>
          </button>
        </nav>
      </div>
    </section>
  )
}