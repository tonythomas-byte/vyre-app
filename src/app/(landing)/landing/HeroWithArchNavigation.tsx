'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './HeroWithArchNavigation.module.css'

interface HeroWithArchNavigationProps {
  userName?: string
  userAvatar: string
  onNavigate?: (destination: 'treasure' | 'journal' | 'calendar') => void
  pillSaved?: boolean
  rotating?: boolean
  resetting?: boolean
  archAvatarRef?: React.RefObject<HTMLDivElement>
  avatarHidden?: boolean
}

// Sparkle positions around the treasure button
const SPARKLES = [
  // Stage 1: Orange/white sparkles inside the button (visible in Screenshot 1)
  { top: '22%',   left: '28%',   size: 10, color: '#FF6B35', delay: 0.1,  duration: 0.25 }, // orange top-left
  { top: '18%',   left: '66%',   size: 12, color: '#FF6B35', delay: 0.15, duration: 0.25 }, // orange top-right
  { top: '32%',   left: '70%',   size: 10, color: '#FFFFFF', delay: 0.2,  duration: 0.25 }, // white right

  // Stage 2: Yellow top sparkle above the button (visible in Screenshot 2)
  { top: '-28px', left: '42%',   size: 24, color: '#FFCC00', delay: 0.35, duration: 0.3  }, // yellow top

  // Stage 3: Massive yellow left sparkle (visible in Screenshot 3)
  { top: '15%',   left: '-26px', size: 48, color: '#FFCC00', delay: 0.55, duration: 0.3  }, // yellow left (huge!)
]

function Sparkle({ top, left, size, color, delay, duration }: typeof SPARKLES[0]) {
  const isYellow = color === '#FFCC00'
  const glowFilter = isYellow
    ? 'drop-shadow(0px 0px 6px rgba(255, 220, 0, 0.95))'
    : color === '#FF6B35'
      ? 'drop-shadow(0px 0px 4px rgba(255, 107, 53, 0.8))'
      : 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.8))'

  return (
    <motion.div
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 30,
        filter: glowFilter,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {/* Thinner, sharper 4-pointed star shape */}
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 0 L12.6 11.4 L24 12 L12.6 12.6 L12 24 L11.4 12.6 L0 12 L11.4 11.4 Z" />
      </svg>
    </motion.div>
  )
}

export default function HeroWithArchNavigation({
  userName = 'there',
  userAvatar,
  onNavigate,
  pillSaved = false,
  rotating = false,
  resetting = false,
  archAvatarRef,
  avatarHidden = false,
}: HeroWithArchNavigationProps) {
  const handleNavigation = (destination: 'treasure' | 'journal' | 'calendar') => {
    if (onNavigate) onNavigate(destination)
  }

  return (
    <section className={styles.heroSection}>
      <div className={styles.archContainer}>
        <div className={styles.archBackground} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.avatarWrapper}>
            {/* ref lets landing page measure arch position for overlay animation */}
            <div ref={archAvatarRef} style={{ opacity: avatarHidden ? 0 : 1 }}>
              <Image
                src={userAvatar}
                alt="Your zen avatar"
                width={180}
                height={180}
                className={styles.avatarImage}
                priority
              />
            </div>
            <div className={styles.greetingBubble}>
              <p className={styles.greeting}>Hi, Good morning</p>
            </div>
          </div>
        </div>

        <nav className={styles.archNavigation} aria-label="Main navigation">

          {/* ── Treasure button — swaps to crystal ball icon when celebrating ── */}
          <button
            className={`${styles.navButton} ${styles.treasureButton}`}
            onClick={() => handleNavigation('treasure')}
            aria-label="Treasure Pills"
            style={{ position: 'relative' }}
          >
            <AnimatePresence mode="wait">
              {pillSaved && !resetting ? (
                <motion.img
                  key="nade"
                  src="/assets/icons/journal/nade.svg"
                  alt=""
                  width={22}
                  height={22}
                  className={styles.navIcon}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1,   opacity: 1 }}
                  exit={{    scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              ) : (
                <motion.img
                  key="treasure"
                  src="/assets/nav%20icons/treasure.png"
                  alt=""
                  width={22}
                  height={22}
                  className={styles.navIcon}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1,   opacity: 1 }}
                  exit={{    scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </AnimatePresence>

            {/* Sparkles — only during clockwise rotation */}
            <AnimatePresence>
              {rotating && SPARKLES.map((s, i) => (
                <Sparkle key={i} {...s} />
              ))}
            </AnimatePresence>

            <span className={styles.navLabel}>Treasure Pills</span>
          </button>

          <button
            className={`${styles.navButton} ${styles.centerButton} ${styles.journalButton}`}
            onClick={() => handleNavigation('journal')}
            aria-label="Journal"
          >
            <Image src="/assets/nav%20icons/journal.png" alt="" width={26} height={26} className={styles.navIcon} />
            <span className={styles.navLabel}>Journal</span>
          </button>

          <button
            className={`${styles.navButton} ${styles.calendarButton}`}
            onClick={() => handleNavigation('calendar')}
            aria-label="Calendar"
          >
            <Image src="/assets/nav%20icons/calender.png" alt="" width={22} height={22} className={styles.navIcon} />
            <span className={styles.navLabel}>Calendar</span>
          </button>

        </nav>
      </div>
    </section>
  )
}
