'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
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

const MOODS: MoodOption[] = [
  { id: 1, name: 'sad',      avatar: '/assets/Onboarding-2/sad.svg',      floral: '/assets/Onboarding-2/Fsad.svg',      label: 'Sad'      },
  { id: 2, name: 'happy',    avatar: '/assets/Onboarding-2/happy.svg',    floral: '/assets/Onboarding-2/Fhappy.svg',    label: 'Happy'    },
  { id: 3, name: 'cry',      avatar: '/assets/Onboarding-2/cry.svg',      floral: '/assets/Onboarding-2/Fcry.svg',      label: 'Cry'      },
  { id: 4, name: 'confused', avatar: '/assets/Onboarding-2/confused.svg', floral: '/assets/Onboarding-2/Fconfused.svg', label: 'Confused' },
  { id: 5, name: 'angry',    avatar: '/assets/Onboarding-2/angry.svg',    floral: '/assets/Onboarding-2/Fangry.svg',    label: 'Angry'    },
]

// Fixed item sizes — never inherit from wrapper
const AVATAR_SIZE  = 140   // px  (fixed, per spec 2.2)
const FLORAL_SIZE  = 52    // px  (fixed, per spec 2.2)
// Center-to-center horizontal spacing between items
const AVATAR_STEP  = 160   // px
const FLORAL_STEP  = 60    // px  (scaled proportionally)
// Depth for side items
const SIDE_Z       = -150  // px  (per spec 2.3)
const SIDE_SCALE   = 0.6
const SIDE_OPACITY = 0.8
// Drag threshold to commit to next item (% of step)
const DRAG_THRESHOLD = 0.3

export default function MoodSelector({ onMoodSelect, onFirstSwipe }: MoodSelectorProps) {
  // Index 1 = Happy, centered on load (spec 2.4)
  const [centeredIndex, setCenteredIndex] = useState(1)
  const [isDragging,    setIsDragging]    = useState(false)
  const [isAnimating,   setIsAnimating]   = useState(false)
  const [hasSwipedOnce, setHasSwipedOnce] = useState(false)
  const [showPopup,     setShowPopup]     = useState(true)
  const [dragOffset,    setDragOffset]    = useState(0)  // live px while dragging

  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef    = useRef(0)

  // ── Per-item transform style ─────────────────────────────────────
  // All items sit on the SAME horizontal plane.
  // translateX  → left/right position
  // translateZ  → depth (center=0, sides=SIDE_Z)
  // scale (CSS property, NOT in transform chain) → size
  // visibility  → hide items beyond ±1 (spec 2.3: only 3 visible)

  const itemStyle = (
    index: number,
    step: number,
    drag: number,
    animating: boolean,
  ): React.CSSProperties => {
    const offset = index - centeredIndex
    const x      = offset * step + drag

    const isCenter = offset === 0
    const isSide   = Math.abs(offset) === 1
    const isFar    = Math.abs(offset) > 1

    return {
      transform:   `translateX(${x}px) translateZ(${isCenter ? 0 : SIDE_Z}px)`,
      // scale as standalone CSS property keeps it off the transform chain
      // → items never drift vertically when scaled
      scale:       isCenter ? '1' : isSide ? String(SIDE_SCALE) : '0',
      opacity:     isCenter ? 1 : isSide ? SIDE_OPACITY : 0,
      visibility:  isFar ? 'hidden' : 'visible',
      transition:  animating
        ? 'transform 300ms ease-out, scale 300ms ease-out, opacity 300ms ease-out'
        : 'scale 200ms ease-out, opacity 200ms ease-out',
      pointerEvents: isSide && !isDragging ? 'auto' : isCenter ? 'auto' : 'none',
    }
  }

  // Florals drag offset scaled proportionally to their step size
  const floralDrag = (drag: number) => drag * (FLORAL_STEP / AVATAR_STEP)

  // ── Drag / swipe handlers ────────────────────────────────────────

  const onDragStart = (clientX: number) => {
    if (isAnimating) return
    setIsDragging(true)
    startXRef.current = clientX
  }

  const onDragMove = (clientX: number) => {
    if (!isDragging) return
    setDragOffset(clientX - startXRef.current)
  }

  const onDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    const delta    = dragOffset
    const threshold = AVATAR_STEP * DRAG_THRESHOLD

    let next = centeredIndex
    if      (delta < -threshold) next = Math.min(centeredIndex + 1, MOODS.length - 1)
    else if (delta >  threshold) next = Math.max(centeredIndex - 1, 0)

    const moved = Math.abs(delta) > 5

    if (!hasSwipedOnce && moved) {
      setHasSwipedOnce(true)
      setShowPopup(false)
      onFirstSwipe?.()
    }

    setIsAnimating(true)
    setDragOffset(0)
    setCenteredIndex(next)

    setTimeout(() => {
      setIsAnimating(false)
      if (hasSwipedOnce || moved) {
        onMoodSelect(MOODS[next].name)
      }
    }, 300)
  }, [isDragging, dragOffset, centeredIndex, hasSwipedOnce, onFirstSwipe, onMoodSelect])

  // Global mouseup — drag ends even if cursor leaves component
  useEffect(() => {
    window.addEventListener('mouseup', onDragEnd)
    return () => window.removeEventListener('mouseup', onDragEnd)
  }, [onDragEnd])

  const handleAvatarClick = (index: number) => {
    if (isDragging || isAnimating || !hasSwipedOnce || index === centeredIndex) return
    setIsAnimating(true)
    setCenteredIndex(index)
    setDragOffset(0)
    setTimeout(() => {
      setIsAnimating(false)
      onMoodSelect(MOODS[index].name)
    }, 300)
  }

  return (
    <div className={styles.moodSelectorContainer}>

      {showPopup && (
        <div className={styles.popup}>Select your mood by swiping</div>
      )}

      {/* ── Avatar Carousel ── */}
      <div
        ref={containerRef}
        className={styles.carouselWrapper}
        onMouseDown={e  => { e.preventDefault(); onDragStart(e.clientX) }}
        onMouseMove={e  => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onTouchStart={e => onDragStart(e.touches[0].clientX)}
        onTouchMove={e  => { e.preventDefault(); onDragMove(e.touches[0].clientX) }}
        onTouchEnd={onDragEnd}
      >
        {/* Stage: perspective lives here, items are absolute inside */}
        <div className={styles.carouselStage}>
          {MOODS.map((mood, index) => (
            <figure
              key={mood.id}
              className={`${styles.carouselItem} ${index === centeredIndex ? styles.active : ''}`}
              style={itemStyle(index, AVATAR_STEP, dragOffset, isAnimating)}
              onClick={() => handleAvatarClick(index)}
            >
              <Image
                src={mood.avatar}
                alt={mood.label}
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
                className={styles.avatarImage}
                draggable={false}
                priority={index <= 2}
              />
            </figure>
          ))}
        </div>
      </div>

      {/* Shadow */}
      <div className={styles.shadowCircle} />

      {/* ── Floral Carousel ── */}
      <div className={styles.floralWrapper}>
        <div className={styles.floralStage}>
          {MOODS.map((mood, index) => (
            <figure
              key={`floral-${mood.id}`}
              className={`${styles.floralItem} ${index === centeredIndex ? styles.activeFloral : ''}`}
              style={itemStyle(index, FLORAL_STEP, floralDrag(dragOffset), isAnimating)}
            >
              <Image
                src={mood.floral}
                alt={`${mood.label} floral`}
                width={FLORAL_SIZE}
                height={FLORAL_SIZE}
                className={styles.floralImage}
                draggable={false}
                priority={index <= 2}
              />
            </figure>
          ))}
        </div>
      </div>

    </div>
  )
}
