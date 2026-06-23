                  'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './journal-2.module.css'

interface Activity {
  id: string
  icon: string
  label: string
}

const activities: Activity[] = [
  { id: 'work',        icon: '/assets/icons/journal/work.svg',                                label: 'Work'     },
  { id: 'pet',         icon: '/assets/icons/journal/pet.svg',                                 label: 'Pet'      },
  { id: 'blender',     icon: '/assets/icons/journal/ic_baseline-blender.svg',                 label: 'Shld'     },
  { id: 'camera',      icon: '/assets/icons/journal/Vector.svg',                              label: 'Shvld'    },
  { id: 'party',       icon: '/assets/icons/journal/material-symbols_sports-bar-rounded.svg', label: 'Party'    },
  { id: 'jogging',     icon: '/assets/icons/journal/Vector (1).svg',                          label: 'Jogging'  },
  { id: 'agriculture', icon: '/assets/icons/journal/ic_baseline-agriculture.svg',             label: 'Shldshld' },
  { id: 'castle',      icon: '/assets/icons/journal/ic_baseline-castle.svg',                  label: 'Shld'     },
]

export default function Journal2Page() {
  const router = useRouter()
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])

  const handleActivityClick = (activityId: string) => {
    setSelectedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId)
      } else {
        return [...prev, activityId]
      }
    })
    router.push('/journal-3')
  }

  const handleOthersClick = () => {
    console.log('Others clicked - future implementation')
  }

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.floralBackground}>
          <Image
            src="/assets/icons/journal/floral under avatar.svg"
            alt=""
            width={280}
            height={280}
            className={styles.floralImage}
          />
        </div>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
          <div className={styles.zenCharacter}>
            <Image
              src="/assets/images/landing/Zen_character.png"
              alt="Zen character"
              width={120}
              height={120}
              className={styles.characterImage}
            />
          </div>
          <img
            src="/assets/journal/vector.png"
            alt=""
            className={styles.characterShadow}
          />
        </div>
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
      <button className={styles.activityCard} onClick={handleOthersClick}>
        <div className={styles.iconWrapper}>
          <span className={styles.plusIcon}>+</span>
        </div>
        <span className={styles.activityLabel}>others</span>
      </button>
    </div>
  )
}
