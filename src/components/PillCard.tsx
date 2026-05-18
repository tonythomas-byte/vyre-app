'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import styles from './PillCard.module.css'

interface PillCardProps {
  id: string
  mood: string
  day: string
  date: string
}

export default function PillCard({ id, mood, day, date }: PillCardProps) {
  const router = useRouter()
  const [broken, setBroken] = useState(false)
  const [navigating, setNavigating] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const didNavigate = useRef(false)

  // Step 1: click pill → break open + show reveal card
  const handlePillClick = () => {
    if (!broken && !navigating) setBroken(true)
  }

  // Step 2: called once when the scale transition finishes
  const handleRevealTransitionEnd = (e: React.TransitionEvent) => {
    // Only react to the transform transition (longest one), ignore opacity
    if (e.propertyName !== 'transform') return
    if (!broken || didNavigate.current) return
    didNavigate.current = true
    setNavigating(true)

    sessionStorage.setItem('pillTransition', JSON.stringify({
      from: 'pill',
      cardTop: 241,
      cardLeft: window.innerWidth / 2 - Math.min(319, window.innerWidth - 18) / 2,
      cardWidth: Math.min(319, window.innerWidth - 18),
      cardHeight: 273,
      timestamp: Date.now()
    }))

    // User sees the reveal card, then navigate at 400ms
    setTimeout(() => {
      router.push(
        `/treasure-pill/pill/${id}?mood=${encodeURIComponent(mood)}&day=${encodeURIComponent(day)}&date=${encodeURIComponent(date)}`
      )
    }, 400)
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className={`${styles.pillWrapper} ${broken ? styles.pillWrapperBroken : ''}`}
        onClick={handlePillClick}
      >
        {/* Left half */}
        <div className={`${styles.pillLeft} ${broken ? styles.pillLeftBroken : ''}`}>
          <Image
            src="/assets/illustrations/landing/Frame.svg"
            alt=""
            fill
            sizes="46vw"
            className={styles.frameImg}
            priority
          />
        </div>

        {/* Right half */}
        <div className={`${styles.pillRight} ${broken ? styles.pillRightBroken : ''}`}>
          <p className={styles.moodTitle}>{mood}</p>
          <div className={styles.dateRow}>
            <span className={styles.dayBadge}>
              <Image
                src="/assets/icons/landing/calender.svg"
                alt=""
                width={42}
                height={36}
                className={styles.calendarBg}
              />
              <span className={styles.dayText}>{day}</span>
            </span>
            <span className={styles.dateRest}>{date}</span>
          </div>
        </div>
      </div>

      {typeof window !== 'undefined' && createPortal(
        <>
          {/* Backdrop — click outside to close (only if not navigating) */}
          {broken && !navigating && (
            <div
              className={styles.revealBackdrop}
              onClick={() => setBroken(false)}
            />
          )}

          {/* Reveal card — stays visible until page navigates */}
          <div
            className={`${styles.revealCard} ${broken ? styles.revealCardOpen : ''}`}
            onTransitionEnd={handleRevealTransitionEnd}
            style={{ cursor: 'default', pointerEvents: navigating ? 'none' : 'auto' }}
          >
            <div className={styles.revealTop}>
              <div className={styles.revealCalIcon}>
                <Image
                  src="/assets/icons/landing/calender.svg"
                  alt=""
                  width={71}
                  height={75}
                  className={styles.revealCalImg}
                />
                <span className={styles.revealDate}>{day}, {date}</span>
              </div>
              <p className={styles.revealMood}>{mood}</p>
            </div>
            <Image
              src="/assets/illustrations/landing/player.svg"
              alt=""
              width={174}
              height={224}
              className={styles.revealPlayer}
            />
            <p className={styles.revealSongLabel}>Song from this moment</p>
            <p className={styles.revealSongName}>Happy - Pharrell Williams</p>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
