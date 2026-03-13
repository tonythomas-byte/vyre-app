'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import WheelPicker from '@/components/WheelPicker'
import Button from '@/components/Button'
import styles from './personal-info.module.css'

const EMPLOYMENT_OPTIONS = [
  { id: 'student', label: 'Student' },
  { id: 'employed-ft', label: 'Employed full-time' },
  { id: 'employed-pt', label: 'Employed part-time' },
  { id: 'self-employed', label: 'Self-employed' },
  { id: 'unemployed', label: 'Unemployed' },
  { id: 'retired', label: 'Retired' },
  { id: 'other', label: 'Other' },
]

export default function PersonalInfoPage() {
  const router = useRouter()
  
  // Age state
  const [age, setAge] = useState<number>(24)
  const [isWheelExpanded, setIsWheelExpanded] = useState(false)
  const [ageInteracted, setAgeInteracted] = useState(false)
  
  // Employment state
  const [employmentStatus, setEmploymentStatus] = useState<string | null>(null)
  const [customEmployment, setCustomEmployment] = useState('')
  const [showOtherInput, setShowOtherInput] = useState(false)

  // Progress navigation
  const handleProgressNavigation = (step: number) => {
    if (step === 1) router.push('/onboarding-1')
    else if (step === 2) router.push('/onboarding-2')
    else if (step === 3) return // Current step
  }

  // Age wheel handlers
  const handleWheelExpand = () => {
    setIsWheelExpanded(true)
  }

  const handleWheelCollapse = () => {
    setIsWheelExpanded(false)
    setAgeInteracted(true)
  }

  const handleAgeChange = (newAge: number) => {
    setAge(newAge)
  }

  // Employment handlers
  const handleEmploymentSelect = (id: string) => {
    setEmploymentStatus(id)
    
    // Show/hide "Other" input
    if (id === 'other') {
      setShowOtherInput(true)
    } else {
      setShowOtherInput(false)
      setCustomEmployment('')
    }
  }

  // Continue button logic
  const isContinueEnabled = 
    ageInteracted && 
    employmentStatus !== null &&
    (employmentStatus !== 'other' || customEmployment.length > 0)

  const handleContinue = () => {
    if (!isContinueEnabled) return
    
    // Save data and navigate
    const data = {
      age,
      employmentStatus,
      ...(employmentStatus === 'other' && { customEmployment }),
    }
    
    console.log('Personal info:', data)
    router.push('/onboarding-4')
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
              aria-label="Step 1"
            />
            <button 
              className={styles.capsule}
              onClick={() => handleProgressNavigation(2)}
              aria-label="Step 2"
            />
            <button 
              className={`${styles.capsule} ${styles.capsuleActive}`}
              onClick={() => handleProgressNavigation(3)}
              aria-label="Current step: Personal info"
            />
          </div>
        </div>

        {/* Title */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            Tell us a little more about yourself
          </h1>
        </div>

        {/* Age Question with Wheel Picker */}
        <div className={styles.questionSection}>
          <label className={styles.questionLabel}>
            How old are you?
          </label>
          <div className={styles.ageInputWrapper}>
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
            {EMPLOYMENT_OPTIONS.map((option) => (
              <div key={option.id}>
                <label className={styles.employmentOption}>
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
                
                {/* "Other" text input */}
                {option.id === 'other' && showOtherInput && (
                  <input
                    type="text"
                    value={customEmployment}
                    onChange={(e) => setCustomEmployment(e.target.value)}
                    placeholder="Please specify"
                    className={styles.otherInput}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className={styles.buttonSection}>
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={!isContinueEnabled}
          >
            Continue
          </Button>
        </div>
      </div>
    </PageBackground>
  )
}
