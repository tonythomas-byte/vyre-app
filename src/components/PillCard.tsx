'use client'

import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import styles from './PillCard.module.css'

interface PillCardProps {
  mood: string
  day: string
  date: string
}

export default function PillCard({ mood, day, date }: PillCardProps) {
  const [broken, setBroken] = useState(false)
  const [cardOrigin, setCardOrigin] = useState({ x: '50%', y: '50%' })
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (!broken && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      // Center of the pill
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      setCardOrigin({ x: `${x}px`, y: `${y}px` })
    }
    setBroken(b => !b)
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className={`${styles.pillWrapper} ${broken ? styles.pillWrapperBroken : ''}`}
        onClick={handleClick}
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
          {broken && (
            <div className={styles.revealBackdrop} onClick={() => setBroken(false)} />
          )}
          <div
            className={`${styles.revealCard} ${broken ? styles.revealCardOpen : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.revealTop}>
              <div className={styles.revealCalIcon}>
                <Image src="/assets/icons/landing/calender.svg" alt="" width={71} height={75} className={styles.revealCalImg} />
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
