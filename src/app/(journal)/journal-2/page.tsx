'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import FooterNav from '@/components/FooterNav'
import Image from 'next/image'
import styles from './journal-2.module.css'

interface Activity {
  id: string
  icon: string
  label: string
}

const activities: Activity[] = [
  { id: 'work',        icon: '/assets/journal/work.svg',                                label: 'Work'     },
  { id: 'pet',         icon: '/assets/journal/pet.svg',                                 label: 'Pet'      },
  { id: 'blender',     icon: '/assets/journal/ic_baseline-blender.svg',                 label: 'Shld'     },
  { id: 'camera',      icon: '/assets/journal/Vector.svg',                              label: 'Shvld'    },
  { id: 'party',       icon: '/assets/journal/material-symbols_sports-bar-rounded.svg', label: 'Party'    },
  { id: 'jogging',     icon: '/assets/journal/Vector (1).svg',                          label: 'Jogging'  },
  { id: 'agriculture', icon: '/assets/journal/ic_baseline-agriculture.svg',             label: 'Shldshld' },
  { id: 'castle',      icon: '/assets/journal/ic_baseline-castle.svg',                  label: 'Shld'     },
]

export default function Journal2Page() {
  const router = useRouter()
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])

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

  const handleActivityClick = (activityId: string) => {
    setSelectedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId)
      } else {
        return [...prev, activityId]
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
              src="/assets/journal/floral under avatar.svg"
              alt="Floral decoration"
              width={140}
              height={140}
              className={styles.floralImage}
            />
          </div>
          <div className={styles.zenCharacter}>
            <Image
              src="/assets/images/landing/Zen_character.png"
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
            That's great to hear! What helped you feel this calm today?
          </h1>
        </div>

        {/* Activity Grid */}
        <div className={styles.activityGrid}>
          {activities.map((activity) => (
            <button
              key={activity.id}
              className={`${styles.activityCard} ${
                selectedActivities.includes(activity.id) ? styles.selected : ''
              }`}
              onClick={() => handleActivityClick(activity.id)}
            >
              <div className={styles.iconWrapper}>
                <Image
                  src={activity.icon}
                  alt={activity.label}
                  width={48}
                  height={48}
                  className={styles.activityIcon}
                />
              </div>
              <span className={styles.activityLabel}>{activity.label}</span>
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

