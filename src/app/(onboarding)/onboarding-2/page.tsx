'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import MoodSelector, { MoodType } from './MoodSelector'
import Button from '@/components/Button'
import styles from './onboarding-2.module.css'

export default function Onboarding2() {
  const router = useRouter()
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [continueEnabled, setContinueEnabled] = useState(false) // Enable after first swipe

  const handleProgressNavigation = (step: number) => {
    if (step === 1) {
      // Current step - do nothing or scroll to top
      return
    } else if (step === 2) {
      // Navigate to next onboarding page
      router.push('/onboarding-3')
    } else if (step === 3) {
      // Navigate to final onboarding page
      router.push('/onboarding-final')
    }
  }

  const handleMoodSelect = (mood: MoodType | null) => {
    setSelectedMood(mood)
  }

  const handleFirstSwipe = () => {
    // Enable continue button on first swipe gesture
    setContinueEnabled(true)
  }

  const handleContinue = () => {
    if (!continueEnabled) {
      // Button disabled - do nothing
      return
    }
    // Continue with selected mood (or current active mood)
    const moodToUse = selectedMood || 'sad' // Default to sad if no mood selected
    console.log('Selected mood:', moodToUse)
    router.push('/onboarding-3')
  }

  return (
    <PageBackground>
      <div className={styles.container}>
        {/* Progress Navigation */}
        <div className={styles.progressSection}>
          <div className={styles.progressIndicators}>
            <button 
              className={`${styles.capsule} ${styles.capsuleActive}`}
              onClick={() => handleProgressNavigation(1)}
              aria-label="Current step: Mood selection"
            />
            <button 
              className={styles.capsule}
              onClick={() => handleProgressNavigation(2)}
              aria-label="Next step"
            />
            <button 
              className={styles.capsule}
              onClick={() => handleProgressNavigation(3)}
              aria-label="Final step"
            />
          </div>
        </div>

        {/* Primary Prompt */}
        <div className={styles.promptSection}>
          <h1 className={styles.promptText}>
            What mood is painting your world today?
          </h1>
        </div>

        {/* Mood Selector Carousel */}
        <div className={styles.selectorWrapper}>
          <MoodSelector 
            onMoodSelect={handleMoodSelect}
            onFirstSwipe={handleFirstSwipe}
          />
        </div>

        {/* Continue Button */}
        <div className={styles.buttonSection}>
          <div className={styles.buttonWrapper}>
            <Button 
              variant="primary" 
              onClick={handleContinue}
              disabled={!continueEnabled}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}