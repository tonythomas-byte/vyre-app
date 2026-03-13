import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import styles from './MoodSelector.module.css'

export type MoodType = 'sad' | 'happy' | 'cry' | 'confused' | 'angry'

interface MoodOption {
  id: number
  name: MoodType
  avatar: string
  floral: string
  label: string
}

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType | null) => void
  onFirstSwipe?: () => void
}

// Mood order from documentation: Sad, Happy, Cry, Confused, Angry
const MOODS: MoodOption[] = [
  { id: 1, name: 'sad', avatar: '/assets/Onboarding-2/sad.svg', floral: '/assets/Onboarding-2/Fsad.svg', label: 'Sad' },
  { id: 2, name: 'happy', avatar: '/assets/Onboarding-2/happy.svg', floral: '/assets/Onboarding-2/Fhappy.svg', label: 'Happy' },
  { id: 3, name: 'cry', avatar: '/assets/Onboarding-2/cry.svg', floral: '/assets/Onboarding-2/Fcry.svg', label: 'Cry' },
  { id: 4, name: 'confused', avatar: '/assets/Onboarding-2/confused.svg', floral: '/assets/Onboarding-2/Fconfused.svg', label: 'Confused' },
  { id: 5, name: 'angry', avatar: '/assets/Onboarding-2/angry.svg', floral: '/assets/Onboarding-2/Fangry.svg', label: 'Angry' },
]

export default function MoodSelector({ onMoodSelect, onFirstSwipe }: MoodSelectorProps) {
  // State management
  const [currentIndex, setCurrentIndex] = useState(0) // Start at Sad (index 0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasSwipedOnce, setHasSwipedOnce] = useState(false) // Track first swipe
  const [showPopup, setShowPopup] = useState(true) // Show popup initially
  
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)

  // Progressive disclosure: Show 3 avatars only after first swipe
  const sideAvatarsVisible = hasSwipedOnce

  // Calculate carousel position based on 3-item view (33.333% per item)
  const getTranslateX = () => {
    const baseOffset = -currentIndex * 33.333
    return baseOffset + dragOffset
  }

  // Handle drag start
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setIsAnimating(false)
    startXRef.current = clientX
    currentXRef.current = clientX
  }

  // Handle drag move - smooth, continuous tracking
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    
    const delta = clientX - startXRef.current
    const containerWidth = containerRef.current?.offsetWidth || 1
    
    // Convert pixel movement to percentage (based on 3-item view)
    const percentDelta = (delta / containerWidth) * 100
    
    setDragOffset(percentDelta)
    currentXRef.current = clientX
  }

  // Handle drag end - calculate snap target and animate
  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    // First swipe detection
    if (!hasSwipedOnce) {
      setHasSwipedOnce(true)
      setShowPopup(false)
      onFirstSwipe?.()
    }
    
    const containerWidth = containerRef.current?.offsetWidth || 1
    const threshold = containerWidth * 0.4 // 40% swipe threshold
    const totalDelta = currentXRef.current - startXRef.current
    
    let newIndex = currentIndex
    
    // Only allow movement if threshold is met and not at edges
    if (Math.abs(totalDelta) >= threshold) {
      if (totalDelta > 0 && currentIndex > 0) {
        // Swiped right → previous mood
        newIndex = currentIndex - 1
      } else if (totalDelta < 0 && currentIndex < MOODS.length - 1) {
        // Swiped left → next mood
        newIndex = currentIndex + 1
      }
    }
    
    // Snap to target with animation
    setIsAnimating(true)
    setCurrentIndex(newIndex)
    setDragOffset(0)
    
    // Floral icon updates AFTER snap completes (250ms delay)
    setTimeout(() => {
      setIsAnimating(false)
      onMoodSelect(MOODS[newIndex].name)
    }, 250)
  }

  // Handle avatar click
  const handleAvatarClick = (index: number) => {
    if (isDragging || !sideAvatarsVisible) return
    
    // First swipe detection on click
    if (!hasSwipedOnce) {
      setHasSwipedOnce(true)
      setShowPopup(false)
      onFirstSwipe?.()
    }
    
    setIsAnimating(true)
    setCurrentIndex(index)
    
    setTimeout(() => {
      setIsAnimating(false)
      onMoodSelect(MOODS[index].name)
    }, 250)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleDragEnd()
    }
    
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [isDragging])

  return (
    <div className={styles.moodSelectorContainer}>
      {/* Popup Message - Shows initially, dismisses on first swipe */}
      {showPopup && (
        <div className={styles.popup}>
          Select your mood by swiping
        </div>
      )}

      {/* Avatar Carousel - Shows 3 at once after first swipe */}
      <div 
        ref={containerRef}
        className={styles.carouselWrapper}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`${styles.carouselTrack} ${isAnimating ? styles.animating : ''}`}
          style={{
            transform: `translateX(${getTranslateX()}%)`,
          }}
        >
          {MOODS.map((mood, index) => {
            const isActive = index === currentIndex
            const isLeft = index === currentIndex - 1
            const isRight = index === currentIndex + 1
            
            // Progressive disclosure: Only show center initially, then 3 after first swipe
            const shouldShow = isActive || (sideAvatarsVisible && (isLeft || isRight))
            
            return (
              <div
                key={mood.id}
                className={`${styles.avatarSlide} ${isActive ? styles.active : ''}`}
                onClick={() => handleAvatarClick(index)}
                style={{
                  opacity: shouldShow ? (isActive ? 1 : 0.3) : 0,
                  pointerEvents: shouldShow ? 'auto' : 'none',
                }}
              >
                <Image 
                  src={mood.avatar} 
                  alt={mood.label}
                  width={200}
                  height={200}
                  className={styles.avatarImage}
                  style={{
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  }}
                  draggable={false}
                  priority={index === 0} // Preload first avatar
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Fixed Shadow Circle - stays centered between avatars and florals */}
      <div className={styles.shadowCircle} />

      {/* Floral Indicators - Shows 3 at once after first swipe, synced with avatars */}
      <div className={styles.floralWrapper}>
        <div 
          className={`${styles.floralTrack} ${isAnimating ? styles.animating : ''}`}
          style={{
            transform: `translateX(${getTranslateX()}%)`,
          }}
        >
          {MOODS.map((mood, index) => {
            const isActive = index === currentIndex
            const isLeft = index === currentIndex - 1
            const isRight = index === currentIndex + 1
            
            // Progressive disclosure: Match avatar visibility
            const shouldShow = isActive || (sideAvatarsVisible && (isLeft || isRight))
            
            return (
              <div
                key={`floral-${mood.id}`}
                className={`${styles.floralSlide} ${isActive ? styles.activeFloral : ''}`}
                style={{
                  opacity: shouldShow ? (isActive ? 1 : 0.3) : 0,
                }}
              >
                <Image 
                  src={mood.floral} 
                  alt={`${mood.label} indicator`}
                  width={50}
                  height={50}
                  className={styles.floralImage}
                  style={{
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  }}
                  draggable={false}
                  priority={index === 0} // Preload first floral
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
