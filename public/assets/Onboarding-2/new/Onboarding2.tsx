import { useState } from 'react'
import MoodSelector, { MoodType } from '@/components/MoodSelector'
import styles from './Onboarding2.module.css'

interface Onboarding2Props {
  onContinue: (mood: MoodType) => void
}

export default function Onboarding2({ onContinue }: Onboarding2Props) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [continueEnabled, setContinueEnabled] = useState(false) // Enable after first swipe

  const handleMoodSelect = (mood: MoodType | null) => {
    setSelectedMood(mood)
  }

  const handleFirstSwipe = () => {
    // Enable continue button on first swipe gesture
    setContinueEnabled(true)
  }

  const handleContinue = () => {
    if (!continueEnabled || !selectedMood) {
      // Show toast or do nothing if button is disabled
      return
    }
    onContinue(selectedMood)
  }

  return (
    <div className={styles.pageContainer}>
      {/* Heading */}
      <h1 className={styles.heading}>
        What mood is painting your world today?
      </h1>

      {/* Mood Selector Carousel */}
      <div className={styles.selectorWrapper}>
        <MoodSelector 
          onMoodSelect={handleMoodSelect}
          onFirstSwipe={handleFirstSwipe}
        />
      </div>

      {/* Continue Button - Enabled after first swipe */}
      <button
        className={`${styles.continueButton} ${!continueEnabled ? styles.disabled : ''}`}
        onClick={handleContinue}
        disabled={!continueEnabled}
      >
        Continue
      </button>
    </div>
  )
}
