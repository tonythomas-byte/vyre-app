'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import FooterNav from '@/components/FooterNav'
import Image from 'next/image'
import styles from './journal-3.module.css'

interface Feeling {
  id: string
  icon: string
  label: string
}

const feelings: Feeling[] = [
  { id: 'eccentric', icon: '/assets/journal/journal-3/Vector.png', label: 'Eccentric' },
  { id: 'obscure', icon: '/assets/journal/journal-3/Vector (1).png', label: 'Obscure' },
  { id: 'sdhgk', icon: '/assets/journal/journal-3/streamline_chess-king.png', label: 'sdhgk' },
  { id: 'sdhglx', icon: '/assets/journal/journal-3/Vector (6).png', label: 'sdhglx' },
  { id: 'thankful', icon: '/assets/journal/journal-3/Vector (2).png', label: 'Thankful' },
  { id: 'amused', icon: '/assets/journal/journal-3/mdi_super-chat-for-good.png', label: 'Amused' },
  { id: 'blissed', icon: '/assets/journal/journal-3/Vector (3).png', label: 'Blissed' },
  { id: 'lgth', icon: '/assets/journal/journal-3/Vector (4).png', label: 'lgth' },
]

export default function Journal3Page() {
  const router = useRouter()
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([])

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

  const handleFeelingClick = (feelingId: string) => {
    setSelectedFeelings(prev => {
      if (prev.includes(feelingId)) {
        return prev.filter(id => id !== feelingId)
      } else {
        return [...prev, feelingId]
      }
    })
  }

  const handleOthersClick = () => {
    console.log('Others clicked - future implementation')
  }

  return (
    <PageBackground>
      <div className={styles.pageContainer}>
        {/* Zen Character with Floral Background */}
        <div className={styles.heroSection}>
          <div className={styles.floralBackground}>
            <Image
              src="/assets/journal/L1.png"
              alt="Floral decoration"
              width={140}
              height={140}
              className={styles.floralImage}
            />
          </div>
          <div className={styles.zenCharacter}>
            <Image
              src="/assets/landing-2/Zen_character.png"
              alt="Zen character"
              width={120}
              height={120}
              className={styles.characterImage}
            />
          </div>
          <div className={styles.characterShadow} />
        </div>

        {/* Question Text */}
        <div className={styles.questionSection}>
          <h1 className={styles.questionText}>
            Describe how you felt while doing this?
          </h1>
        </div>

        {/* Feelings Grid */}
        <div className={styles.feelingsGrid}>
          {feelings.map((feeling) => (
            <button
              key={feeling.id}
              className={`${styles.feelingCard} ${
                selectedFeelings.includes(feeling.id) ? styles.selected : ''
              }`}
              onClick={() => handleFeelingClick(feeling.id)}
            >
              <div className={styles.iconWrapper}>
                <Image
                  src={feeling.icon}
                  alt={feeling.label}
                  width={48}
                  height={48}
                  className={styles.feelingIcon}
                />
              </div>
              <span className={styles.feelingLabel}>{feeling.label}</span>
            </button>
          ))}
        </div>

        {/* Others Button */}
        <button className={styles.othersButton} onClick={handleOthersClick}>
          <span className={styles.plusIcon}>+</span>
          <span className={styles.othersText}>others</span>
        </button>

        {/* Footer Navigation */}
        <footer className={styles.footerSection}>
          <FooterNav onNavigate={handleFooterNavigation} />
        </footer>
      </div>
    </PageBackground>
  )
}
