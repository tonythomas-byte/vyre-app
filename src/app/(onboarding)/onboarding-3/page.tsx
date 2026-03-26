'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import Checkbox from '@/components/Checkbox'
import Button from '@/components/Button'
import styles from './onboarding-3.module.css'

interface VyreReason {
  id: number
  label: string
}

interface ExploreTopic {
  id: number
  label: string
}

const vyreReasons: VyreReason[] = [
  { id: 1, label: 'To manage stress' },
  { id: 2, label: 'To track my mood' },
  { id: 3, label: 'To improve self-awareness' },
  { id: 4, label: 'To find support' }
]

const exploreTopics: ExploreTopic[] = [
  { id: 1, label: 'Anxiety' },
  { id: 2, label: 'Depression' },
  { id: 3, label: 'Relationships' },
  { id: 4, label: 'Work' },
  { id: 5, label: 'Creativity' },
  { id: 6, label: 'Mindfulness' },
  { id: 7, label: 'Self-care' }
]

export default function Onboarding3() {
  const router = useRouter()
  const [selectedReason, setSelectedReason] = useState<VyreReason | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<ExploreTopic[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const Q2_MAX = 3

  // Validation
  const question1Valid = selectedReason !== null
  const question2Valid = selectedTopics.length >= 1 && selectedTopics.length <= Q2_MAX
  const continueEnabled = question1Valid && question2Valid

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleProgressNavigation = (step: number) => {
    if (step === 1) {
      // Navigate back to onboarding-2
      router.push('/onboarding-2')
    } else if (step === 2) {
      // Current step - do nothing
      return
    } else if (step === 3) {
      // Try to navigate forward
      if (continueEnabled) {
        handleContinue()
      } else {
        showToastMessage('Please complete both questions')
      }
    }
  }

  const handleReasonSelect = (reason: VyreReason) => {
    // Single-select behavior (radio button logic with checkbox UI)
    if (selectedReason?.id === reason.id) {
      // User clicked already selected option - keep it selected (cannot unselect)
      return
    }
    setSelectedReason(reason)
  }

  const handleTopicToggle = (topic: ExploreTopic) => {
    const isSelected = selectedTopics.some(t => t.id === topic.id)
    
    if (isSelected) {
      // Uncheck - allow going to 0 (will disable Continue button)
      setSelectedTopics(selectedTopics.filter(t => t.id !== topic.id))
    } else {
      // Check - add if under limit
      if (selectedTopics.length < Q2_MAX) {
        setSelectedTopics([...selectedTopics, topic])
      } else {
        // At maximum - show toast
        showToastMessage('Maximum 3 topics')
      }
    }
  }

  const handleContinue = () => {
    if (!continueEnabled) return
    
    // Save selections and navigate
    console.log('Preferences:', {
      selectedReason,
      selectedTopics
    })
    
    // Navigate to next step
    router.push('/onboarding-final')
  }

  return (
    <PageBackground>
      <div className={styles.container}>
        {/* Progress Navigation */}
        <div className={styles.progressSection}>
          <div className={styles.progressIndicators}>
            <button 
              className={styles.capsule}
              onClick={() => handleProgressNavigation(1)}
              aria-label="Previous step: Mood selection"
            />
            <button 
              className={`${styles.capsule} ${styles.capsuleActive}`}
              onClick={() => handleProgressNavigation(2)}
              aria-label="Current step: Preferences"
            />
            <button 
              className={styles.capsule}
              onClick={() => handleProgressNavigation(3)}
              aria-label="Next step"
            />
          </div>
        </div>

        {/* Page Title */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            Tell us a little more about yourself
          </h1>
        </div>

        {/* Scrollable Content Area */}
        <div className={styles.contentArea}>
          {/* Question 1 */}
          <div className={styles.questionSection}>
            <h2 className={styles.questionHeading}>
              What brings you to Vyre?
            </h2>
            <div className={styles.optionsList}>
              {vyreReasons.map((reason) => (
                <div
                  key={reason.id}
                  className={styles.optionItem}
                  onClick={() => handleReasonSelect(reason)}
                >
                  <Checkbox
                    checked={selectedReason?.id === reason.id}
                    onChange={() => handleReasonSelect(reason)}
                  />
                  <span className={styles.optionLabel}>{reason.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className={styles.questionSection}>
            <h2 className={styles.questionHeading}>
              What are some topics you'd like to explore in Vyre?
            </h2>
            <div className={styles.optionsList}>
              {exploreTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={styles.optionItem}
                  onClick={() => handleTopicToggle(topic)}
                >
                  <Checkbox
                    checked={selectedTopics.some(t => t.id === topic.id)}
                    onChange={() => handleTopicToggle(topic)}
                  />
                  <span className={styles.optionLabel}>{topic.label}</span>
                </div>
              ))}
            </div>
          </div>
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

        {/* Toast Message */}
        {showToast && (
          <div className={styles.toast}>
            {toastMessage}
          </div>
        )}
      </div>
    </PageBackground>
  )
}
