'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import CompanionCard from './CompanionCard'
import styles from './onboarding.module.css'

const companions = [
  { id: 1, name: 'Zen Master', unlocked: true,  image: '/assets/images/onboarding/zen_onbd.png' },
  { id: 2, name: 'Night Wolf', unlocked: false, image: '/assets/images/onboarding/zen_onbd.png' },
  { id: 3, name: 'Wise Tiger', unlocked: false, image: '/assets/images/onboarding/zen_onbd.png' },
  { id: 4, name: 'Happy Frog', unlocked: false, image: '/assets/images/onboarding/zen_onbd.png' },
]

export default function Onboarding() {
  const router = useRouter()
  const [showMessage, setShowMessage] = useState(false)

  const handleCompanionSelect = (companion: typeof companions[0]) => {
    console.log('Avatar clicked:', companion.name, 'Unlocked:', companion.unlocked)
    
    if (companion.unlocked) {
      console.log('Navigating to onboarding-2')
      router.push('/onboarding-2')
    } else {
      console.log('Showing popup message')
      setShowMessage(true)
      // Auto-hide after 5 seconds (optional - user can still click outside to close)
      setTimeout(() => setShowMessage(false), 5000)
    }
  }

  const handleClosePopup = () => {
    setShowMessage(false)
  }

  return (
    <PageBackground>
      <div className={styles.container}>
        {/* Header section */}
        <header className={styles.headerSection}>
          <h1 className={styles.title}>Meet Your Journey Companion!</h1>
        </header>

        {/* Paragraph section */}
        <div className={styles.paragraphSection}>
          <p className={styles.subtitle}>
            Choose your Vyre avatar. It helps express your moods and guide reflections.
          </p>
        </div>

        {/* Avatar container */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatarGrid}>
            {companions.map((companion) => (
              <div key={companion.id} className={styles.avatarItem}>
                <CompanionCard
                  companion={companion}
                  onClick={() => handleCompanionSelect(companion)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Popup Message Overlay */}
        {showMessage && (
          <div 
            className={styles.popupOverlay}
            onClick={handleClosePopup}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-message"
          >
            <div 
              className={styles.popupMessage}
              onClick={(e) => e.stopPropagation()}
              id="popup-message"
            >
              This companion unlocks when you complete your streak.
            </div>
          </div>
        )}
      </div>
    </PageBackground>
  )
}
