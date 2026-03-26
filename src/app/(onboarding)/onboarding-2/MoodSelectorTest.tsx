'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from './MoodSelectorTest.module.css'

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
  { id: 1, name: 'sad',      avatar: '/assets/test/avatar/sad.png',      floral: '/assets/test/floral/fasd.png',      label: 'Sad'      },
  { id: 2, name: 'happy',    avatar: '/assets/test/avatar/happy.png',    floral: '/assets/test/floral/fhappy.png',    label: 'Happy'    },
  { id: 3, name: 'cry',      avatar: '/assets/test/avatar/cry.png',      floral: '/assets/test/floral/fcry.png',      label: 'Cry'      },
  { id: 4, name: 'confused', avatar: '/assets/test/avatar/confused.png', floral: '/assets/test/floral/fconfused.png', label: 'Confused' },
  { id: 5, name: 'angry',    avatar: '/assets/test/avatar/angry.png',    floral: '/assets/test/floral/fangry.png',    label: 'Angry'    },
]

// ── Avatar constants (unchanged) ──────────────────────────────────
const AVATAR_SIZE    = 150
const TOTAL_ITEMS    = MOODS.length        // 5
const ANGLE_STEP     = 360 / TOTAL_ITEMS   // 72°
const AVATAR_RADIUS  = Math.round((AVATAR_SIZE / 2) / Math.tan((Math.PI * ANGLE_STEP) / (2 * 180)))
const DRAG_THRESHOLD = 20

// ── Floral carousel constants ─────────────────────────────────────
//
// 5 slots always visible: [-2, -1, 0, +1, +2] relative to center
// Each slot has a fixed X position, size, depth and opacity.
// When an icon wraps around, it jumps slot instantly while faded out.
//
const FLORAL_BASE     = 85    // px — size at center slot (increased from 70)

// X positions for each slot (offset from stage center, in px)
// More spacing between slots so all 5 are clearly separated
const SLOT_X: Record<number, number> = {
  '-2': -220,  // far left - increased spacing from adjacent
  '-1': -85,   // adjacent left
   '0':   0,   // center
   '1':  85,   // adjacent right
   '2': 220,   // far right - increased spacing from adjacent
}

// Visual properties per slot — symmetric, largest at center
const SLOT_CONFIG: Record<number, { scale: number; z: number; opacity: number; size: number }> = {
  '-2': { scale: 0.48, z: -100, opacity: 0.55, size: FLORAL_BASE * 0.48 },
  '-1': { scale: 0.70, z:  -50, opacity: 0.78, size: FLORAL_BASE * 0.70 },
   '0': { scale: 1.00, z:    0, opacity: 1.00, size: FLORAL_BASE        },
   '1': { scale: 0.70, z:  -50, opacity: 0.78, size: FLORAL_BASE * 0.70 },
   '2': { scale: 0.48, z: -100, opacity: 0.55, size: FLORAL_BASE * 0.48 },
}

// How many px of live drag equals one full slot step
// Avatar drag is in degrees; 1 step = ANGLE_STEP degrees
// We map that to px so floral slides in sync with avatar
const DRAG_PX_PER_STEP = 85   // matches slot spacing at ±1 (increased from 64)

export default function MoodSelectorTest({ onMoodSelect, onFirstSwipe }: MoodSelectorProps) {
  const [centeredIndex, setCenteredIndex] = useState(1)
  const [isDragging,    setIsDragging]    = useState(false)
  const [isAnimating,   setIsAnimating]   = useState(false)
  const [hasSwipedOnce, setHasSwipedOnce] = useState(false)
  const [showPopup,     setShowPopup]     = useState(true)
  const [dragOffset,    setDragOffset]    = useState(0)   // degrees (avatar)
  const [rotation,      setRotation]      = useState(0)   // degrees (avatar)

  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef    = useRef(0)

  // ── Avatar item style (unchanged) ─────────────────────────────────
  const avatarItemStyle = (
    index: number,
    drag: number,
    animating: boolean,
  ): React.CSSProperties => {
    const baseAngle    = -(index * ANGLE_STEP)
    const currentAngle = baseAngle + rotation + drag
    const norm         = ((currentAngle % 360) + 540) % 360 - 180
    const abs          = Math.abs(norm)

    let scale: number, opacity: number, zIndex: number
    let faceTilt: number, inwardNudge: number

    if (abs < 36) {
      scale = 1.2; opacity = 1.0; zIndex = 100; faceTilt = 0; inwardNudge = 0
    } else if (abs < 108) {
      scale = 0.78; opacity = 0.85; zIndex = 60
      faceTilt    = norm > 0 ? -50 : 50
      inwardNudge = 0
    } else {
      scale = 0.45; opacity = 0.70; zIndex = 30
      faceTilt    = norm > 0 ? -110 : 110
      inwardNudge = norm > 0 ? AVATAR_RADIUS * 0.55 : -(AVATAR_RADIUS * 0.55)
    }

    return {
      transform:     `rotateY(${currentAngle}deg) translateZ(${AVATAR_RADIUS}px) rotateY(${faceTilt}deg) translateX(${inwardNudge}px)`,
      scale:         scale.toString(),
      opacity,
      zIndex,
      visibility:    'visible',
      transition:    animating
        ? 'transform 400ms ease-out, scale 300ms ease-out, opacity 300ms ease-out'
        : 'scale 200ms ease-out, opacity 200ms ease-out',
      pointerEvents: abs < 36 ? 'auto' : 'none',
    }
  }

  // ── Floral item style — circular wrapping horizontal carousel ─────
  //
  // Core idea:
  //   Each floral icon is assigned a SLOT based on its distance from
  //   centeredIndex. Slot 0 = center, ±1 = adjacent, ±2 = far sides.
  //
  //   The "offset" wraps around: with 5 items, offset is always in
  //   [-2, -1, 0, +1, +2] using modular arithmetic.
  //
  //   During live drag, every icon translates by dragPx (continuous slide).
  //   On snap, centeredIndex updates and icons jump to new slots.
  //   The jump is invisible because items at the far edges (slot ±2) are
  //   faded/small — the repositioning happens while they're barely visible.
  //
  //   No icon ever leaves the visible range — they always occupy one of
  //   the 5 fixed slots, just which slot rotates circularly.
  //
  const floralItemStyle = (
    index: number,
    drag: number,       // degrees from avatar drag
    animating: boolean,
  ): React.CSSProperties => {
    // Circular offset: always in range [-2, -1, 0, +1, +2]
    let offset = index - centeredIndex
    // Wrap to [-2..+2] range for 5 items
    if (offset >  2) offset -= TOTAL_ITEMS
    if (offset < -2) offset += TOTAL_ITEMS

    // Convert avatar drag degrees → px slide for floral
    // dragOffset degrees / ANGLE_STEP degrees per step * DRAG_PX_PER_STEP px per step
    const dragPx = (drag / ANGLE_STEP) * DRAG_PX_PER_STEP

    // Base X = slot's fixed position + live drag
    const slotKey = offset.toString()
    const baseX   = SLOT_X[slotKey]
    const x       = baseX + dragPx

    const cfg = SLOT_CONFIG[slotKey]

    // Fade out far items completely during drag so wrap-around jump is invisible
    // Any icon at slot ±2 fades to zero as it moves in either direction
    const isFarSlot = Math.abs(offset) === 2
    const dragFade = isFarSlot
      ? Math.max(0, cfg.opacity * (1 - Math.abs(dragPx) / DRAG_PX_PER_STEP))
      : cfg.opacity

    return {
      // translateX positions on horizontal plane
      // translateZ adds depth — no rotateY so no vertical drift ever
      transform:     `translateX(${x}px) translateZ(${cfg.z}px)`,
      scale:         cfg.scale.toString(),
      opacity:       dragFade,
      zIndex:        100 - Math.abs(offset) * 20,
      visibility:    'visible',
      // During snap animation: smooth transition for all properties
      // During drag: no transition on transform (follows finger), but keep scale/opacity smooth
      transition:    animating
        ? 'transform 400ms ease-out, scale 300ms ease-out, opacity 300ms ease-out'
        : 'scale 200ms ease-out, opacity 150ms ease-out',
      pointerEvents: 'none',
    }
  }

  // ── Drag handlers ─────────────────────────────────────────────────

  const onDragStart = (clientX: number) => {
    if (isAnimating) return
    setIsDragging(true)
    startXRef.current = clientX
  }

  const onDragMove = (clientX: number) => {
    if (!isDragging) return
    setDragOffset((clientX - startXRef.current) * 0.5)
  }

  const onDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    const delta = dragOffset
    const moved = Math.abs(delta) > 5
    let steps   = 0
    if (Math.abs(delta) > DRAG_THRESHOLD) {
      steps = Math.round(delta / ANGLE_STEP)
    }

    let next = centeredIndex - steps
    // Wrap around circularly for floral (avatar doesn't wrap but floral does)
    next = ((next % TOTAL_ITEMS) + TOTAL_ITEMS) % TOTAL_ITEMS

    if (!hasSwipedOnce && moved) {
      setHasSwipedOnce(true)
      setShowPopup(false)
      onFirstSwipe?.()
    }

    setIsAnimating(true)
    setDragOffset(0)
    setRotation(r => r + steps * ANGLE_STEP)
    setCenteredIndex(next)

    setTimeout(() => {
      setIsAnimating(false)
      if (hasSwipedOnce || moved) onMoodSelect(MOODS[next].name)
    }, 400)
  }, [isDragging, dragOffset, centeredIndex, hasSwipedOnce, onFirstSwipe, onMoodSelect])

  useEffect(() => {
    window.addEventListener('mouseup', onDragEnd)
    return () => window.removeEventListener('mouseup', onDragEnd)
  }, [onDragEnd])

  const handleAvatarClick = (index: number) => {
    if (isDragging || isAnimating || !hasSwipedOnce || index === centeredIndex) return
    const steps = centeredIndex - index
    setIsAnimating(true)
    setRotation(r => r + steps * ANGLE_STEP)
    setCenteredIndex(((index % TOTAL_ITEMS) + TOTAL_ITEMS) % TOTAL_ITEMS)
    setDragOffset(0)
    setTimeout(() => {
      setIsAnimating(false)
      onMoodSelect(MOODS[index].name)
    }, 400)
  }

  return (
    <div className={styles.moodSelectorContainer}>

      {showPopup && (
        <div className={styles.popup}>Select your mood by swiping</div>
      )}

      {/* ── Avatar Carousel (unchanged) ── */}
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
        <div className={styles.carouselStage}>
          {MOODS.map((mood, index) => (
            <figure
              key={mood.id}
              className={`${styles.carouselItem} ${index === centeredIndex ? styles.active : ''}`}
              style={avatarItemStyle(index, dragOffset, isAnimating)}
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
              style={floralItemStyle(index, dragOffset, isAnimating)}
            >
              <Image
                src={mood.floral}
                alt={`${mood.label} floral`}
                width={FLORAL_BASE}
                height={FLORAL_BASE}
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
