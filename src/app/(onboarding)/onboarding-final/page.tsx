'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import WheelPicker from './WheelPicker'
import Button from '@/components/Button'
import styles from './onboarding-final.module.css'

interface EmploymentOption {
  id: string
  label: string
}

const employmentOptions: EmploymentOption[] = [
  { id: 'student', label: 'Student' },
  { id: 'employed-ft', label: 'Employed full-time' },
  { id: 'employed-pt', label: 'Employed part-time' },
  { id: 'self-employed', label: 'Self-employed' },
  { id: 'unemployed', label: 'Unemployed' },
  { id: 'retired', label: 'Retired' },
  { id: 'other', label: 'Other' }
]

export default function OnboardingFinal() {
  const router = useRouter()
  
  // Age state
  const [age, setAge] = useState(24) // Default value
  const [isWheelExpanded, setIsWheelExpanded] = useState(false)
  const [ageInteracted, setAgeInteracted] = useState(false)
  
  // Employment state
  const [employmentStatus, setEmploymentStatus] = useState<string | null>(null)

  // Continue enabled when age interacted AND employment selected
  const continueEnabled = ageInteracted && employmentStatus !== null

  const handleProgressNavigation = (step: number) => {
    if (step === 1) {
      router.push('/onboarding-2')
    } else if (step === 2) {
      router.push('/onboarding-3')
    } else if (step === 3) {
      // Current step - scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleWheelExpand = () => {
    setIsWheelExpanded(true)
  }

  const handleWheelCollapse = () => {
    console.log('Wheel collapsing, current age:', age)
    setIsWheelExpanded(false)
    setAgeInteracted(true)
  }

  const handleAgeChange = (newAge: number) => {
    console.log('Age changed to:', newAge)
    setAge(newAge)
  }

  const handleEmploymentSelect = (optionId: string) => {
    // Single-select behavior (radio button logic)
    if (employmentStatus === optionId) {
      // Already selected - keep it selected (cannot unselect)
      return
    }
    
    setEmploymentStatus(optionId)
  }

  const handleContinue = () => {
    if (!continueEnabled) return
    
    // Save selections
    console.log('Personal Info:', {
      age,
      employmentStatus
    })
    
    // Navigate to next step (placeholder)
    console.log('Onboarding complete!')
    // router.push('/dashboard') or wherever next
  }

  return (
    <PageBackground>
      <div className={`${styles.container} ${isWheelExpanded ? styles.containerExpanded : ''}`}>
        {/* Progress Navigation */}
        <div className={styles.progressSection}>
          <div className={styles.progressIndicators}>
            <button 
              className={styles.capsule}
              onClick={() => handleProgressNavigation(1)}
              aria-label="Step 1: Mood selection"
            />
            <button 
              className={styles.capsule}
              onClick={() => handleProgressNavigation(2)}
              aria-label="Step 2: Preferences"
            />
            <button 
              className={`${styles.capsule} ${styles.capsuleActive}`}
              onClick={() => handleProgressNavigation(3)}
              aria-label="Current step: Personal info"
            />
          </div>
        </div>

        {/* Page Title */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            Tell us a little more about yourself
          </h1>
        </div>

        {/* Main Area - wraps content + button, fills remaining space */}
        <div className={styles.mainArea}>
          {/* Content Section - Contains all interactive content */}
          <div className={`${styles.contentSection} ${isWheelExpanded ? styles.expanded : ''}`}>
            {/* Age Question with Wheel Picker */}
            <div className={`${styles.questionSection} ${styles.ageSection} ${isWheelExpanded ? styles.expanded : ''}`}>
              <label className={styles.questionLabel}>
                How old are you?
              </label>
              <div className={`${styles.ageInputWrapper} ${isWheelExpanded ? styles.expanded : ''}`}>
                <WheelPicker
                  value={age}
                  onChange={handleAgeChange}
                  min={1}
                  max={100}
                  isExpanded={isWheelExpanded}
                  onExpand={handleWheelExpand}
                  onCollapse={handleWheelCollapse}
                />
              </div>
            </div>

            {/* Employment Question - Fades out when wheel expands */}
            <div 
              className={`${styles.questionSection} ${styles.employmentSection} ${
                isWheelExpanded ? styles.fadeOut : ''
              }`}
            >
              <label className={styles.questionLabel}>
                What best describes you?
              </label>
              
              <div className={styles.employmentOptions}>
                {employmentOptions.map((option) => (
                  <label key={option.id} className={styles.employmentOption}>
                    <input
                      type="radio"
                      name="employment"
                      value={option.id}
                      checked={employmentStatus === option.id}
                      onChange={() => handleEmploymentSelect(option.id)}
                      className={styles.radioInput}
                    />
                    <span className={styles.checkbox} />
                    <span className={styles.optionLabel}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed bottom block — divider + button, never moves */}
          <div className={styles.bottomBlock}>
            <div className={styles.dividerSection} data-divider="true">
              <div className={styles.dividerWrapper} />
            </div>
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
        </div>
      </div>
    </PageBackground>
  )
}
