'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './journal-3.module.css'

interface Feeling {
  id: string
  icon: string
  label: string
}

const feelings: Feeling[] = [
  { id: 'eccentric', icon: '/assets/icons/journal/Vector.svg',                              label: 'Eccentric' },
  { id: 'obscure',   icon: '/assets/icons/journal/Vector (1).svg',                          label: 'Obscure'   },
  { id: 'sdhgk',     icon: '/assets/icons/journal/streamline_chess-king.svg',               label: 'sdhgk'     },
  { id: 'sdhglx',    icon: '/assets/icons/journal/Vector (5).svg',                          label: 'sdhglx'    },
  { id: 'thankful',  icon: '/assets/icons/journal/Vector (2).svg',                          label: 'Thankful'  },
  { id: 'amused',    icon: '/assets/icons/journal/mdi_super-chat-for-good.svg',             label: 'Amused'    },
  { id: 'blissed',   icon: '/assets/icons/journal/Vector (3).svg',                          label: 'Blissed'   },
  { id: 'lgth',      icon: '/assets/icons/journal/Vector (4).svg',                          label: 'lgth'      },
]

export default function Journal3Page() {
  const router = useRouter()
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([])

  const handleFeelingClick = (feelingId: string) => {
    setSelectedFeelings(prev => {
      if (prev.includes(feelingId)) {
        return prev.filter(id => id !== feelingId)
      } else {
        return [...prev, feelingId]
      }
    })
    router.push('/journal-4')
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
    </div>
  )
}
