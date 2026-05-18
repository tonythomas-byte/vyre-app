'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import styles from './SavePillAnimation.module.css'

// Feeling → mood-specific avatar mapping
const FEELING_AVATAR_MAP: Record<string, string> = {
  eccentric:  '/assets/illustrations/onboarding/avatar/happy.png',
  obscure:    '/assets/illustrations/onboarding/avatar/confused.png',
  sdhgk:      '/assets/illustrations/onboarding/avatar/confused.png',
  sdhglx:     '/assets/illustrations/onboarding/avatar/sad.png',
  thankful:   '/assets/illustrations/onboarding/avatar/happy.png',
  amused:     '/assets/illustrations/onboarding/avatar/happy.png',
  blissed:    '/assets/illustrations/onboarding/avatar/happy.png',
  lgth:       '/assets/illustrations/onboarding/avatar/happy.png',
}
const DEFAULT_AVATAR = '/assets/illustrations/onboarding/avatar/happy.png'

type Phase =
  | 'reveal-in'
  | 'pill-opens'
  | 'card-suck'
  | 'pill-closing' // pill bottoms swing inward after card collapses
  | 'pill-closed'
  | 'mandala-roll'
  | 'pill-break2'
  | 'vyre'
  | 'done'

interface Props {
  mood: string
  day: string
  date: string
  feeling: string
  onComplete: () => void
}

const PHASE_DURATIONS: Record<Phase, number> = {
  'reveal-in':    0,
  'pill-opens':   900,
  'card-suck':    600,   // card collapses first
  'pill-closing': 700,   // then pill bottoms swing in
  'pill-closed':  1000,
  'mandala-roll': 800,
  'pill-break2':  700,
  'vyre':         1400,
  'done':         0,
}

const SEQUENCE: Phase[] = [
  'reveal-in', 'pill-opens', 'card-suck', 'pill-closing', 'pill-closed',
  'mandala-roll', 'pill-break2', 'vyre', 'done'
]

export default function SavePillAnimation({ mood, day, date, feeling, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('pill-opens')
  const [mounted, setMounted] = useState(false)
  const [revealReady, setRevealReady] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const avatarSrc = FEELING_AVATAR_MAP[feeling] ?? DEFAULT_AVATAR

  useEffect(() => {
    setMounted(true)
    // Small rAF delay so CSS transition fires after first paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealReady(true))
    })
  }, [])

  useEffect(() => {
    if (phase === 'done') { onComplete(); return }
    timerRef.current = setTimeout(() => {
      const idx = SEQUENCE.indexOf(phase)
      setPhase(SEQUENCE[idx + 1])
    }, PHASE_DURATIONS[phase])
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase, onComplete])

  if (!mounted) return null

  // Derived booleans
  const pillOpen1        = revealReady && ['pill-opens', 'card-suck', 'pill-closing'].includes(phase)
  const pillSlightlyOpen = false  // unused — pill stays fully open until pill-closed
  const revealScaled     = revealReady && phase === 'pill-opens'
  const cardSucking      = ['card-suck', 'pill-closing'].includes(phase)
  const showRevealCard   = ['pill-opens', 'card-suck', 'pill-closing'].includes(phase)
  const pillClosed       = ['pill-closed', 'mandala-roll', 'pill-break2', 'vyre'].includes(phase)
  const tinyCardFall     = phase === 'pill-closed'
  const moodTextVisible  = ['pill-closed', 'mandala-roll'].includes(phase)
  const dateVisible      = ['pill-closed', 'mandala-roll'].includes(phase)
  const mandalaRight     = ['mandala-roll', 'pill-break2', 'vyre'].includes(phase)
  const pillOpen2        = phase === 'pill-break2'
  const avatarRising     = ['pill-break2', 'vyre'].includes(phase)
  const pillFading       = phase === 'vyre'
  const showVyre         = phase === 'vyre'

  return createPortal(
    <div className={styles.overlay}>

      {/* ── VYRE full-screen background ── */}
      <div className={`${styles.vyreScreen} ${showVyre ? styles.vyreVisible : ''}`} />

      {/* ── VYRE label ── */}
      <div className={`${styles.vyreLabel} ${showVyre ? styles.vyreLabelVisible : ''}`}>
        VYRE
      </div>

      {/* ── Pill scene ── */}
      <div className={`${styles.pillScene} ${pillFading ? styles.pillFading : ''}`}>

        {/* Left half */}
        <div className={`
          ${styles.pillLeft}
          ${pillOpen1 ? styles.pillLeftOpen1 : ''}
          ${pillSlightlyOpen ? styles.pillLeftSlight : ''}
          ${pillOpen2 ? styles.pillLeftOpen2 : ''}
        `}>
          {/* Floral/mandala — translates right on mandala-roll */}
          <div className={`${styles.floralWrap} ${mandalaRight ? styles.floralRight : ''}`}>
            <Image
              src="/assets/icons/journal/floral under avatar.svg"
              alt=""
              width={120}
              height={120}
              className={styles.floralImg}
            />
          </div>
          {/* Zen character — hidden during card-suck */}
          <Image
            src="/assets/images/landing/Zen_character.png"
            alt="zen"
            width={70}
            height={70}
            className={`${styles.pillZen} ${cardSucking ? styles.pillZenHidden : ''}`}
          />
        </div>

        {/* Right half */}
        <div className={`
          ${styles.pillRight}
          ${pillOpen1 ? styles.pillRightOpen1 : ''}
          ${pillSlightlyOpen ? styles.pillRightSlight : ''}
          ${pillOpen2 ? styles.pillRightOpen2 : ''}
        `}>
          {/* Mood text — fades in during pill-closed */}
          <p className={`${styles.pillMood} ${moodTextVisible ? styles.pillMoodVisible : ''}`}>
            {mood}
          </p>
          {/* Date — fades in during pill-closed */}
          <div className={`${styles.pillDateRow} ${dateVisible ? styles.pillDateVisible : ''}`}>
            <Image
              src="/assets/icons/landing/calender.svg"
              alt=""
              width={24}
              height={20}
              className={styles.pillCalIcon}
            />
            <span className={styles.pillDate}>{day} {date}</span>
          </div>
        </div>

        {/* Yellow glow at break point */}
        {(pillOpen1 || pillSlightlyOpen || cardSucking || pillOpen2) && (
          <div className={styles.breakGlow} />
        )}

        {/* Tiny card falling from pill center */}
        {tinyCardFall && (
          <div className={styles.tinyCard}>
            <Image
              src="/assets/icons/landing/calender.svg"
              alt=""
              width={20}
              height={18}
              className={styles.tinyCalIcon}
            />
            <span className={styles.tinyDate}>{day}, {date}</span>
          </div>
        )}

        {/* Avatar rising from pill break */}
        <div className={`${styles.risingAvatar} ${avatarRising ? styles.avatarRisen : ''} ${showVyre ? styles.avatarCenter : ''}`}>
          <Image
            src={avatarSrc}
            alt="mood avatar"
            width={100}
            height={100}
            className={styles.avatarImg}
          />
        </div>

      </div>

      {/* ── Reveal card ── */}
      <div className={`
        ${styles.revealCard}
        ${revealScaled ? styles.revealVisible : ''}
        ${cardSucking && phase === 'card-suck' ? styles.revealSucking : ''}
        ${phase === 'pill-closing' ? styles.revealHolding : ''}
      `}>
        <div className={styles.revealCalWrapper}>
          <Image
            src="/assets/icons/landing/calender.svg"
            alt=""
            width={52}
            height={55}
            className={styles.revealCalImg}
          />
          <span className={styles.revealDate}>{day}, {date}</span>
        </div>
        <p className={styles.revealMood}>{mood}</p>
        <Image
          src="/assets/illustrations/landing/player.svg"
          alt=""
          width={130}
          height={170}
          className={styles.revealPlayer}
        />
        <p className={styles.revealSongLabel}>Song from this moment</p>
        <p className={styles.revealSongName}>Happy - Pharrell Williams</p>
      </div>

      {/* Date rising from bottom (pill-closed phase) */}
      <div className={`${styles.dateRising} ${dateVisible ? styles.dateRisingVisible : ''}`}>
        <span className={styles.dateRisingText}>{day}, {date}</span>
      </div>

    </div>,
    document.body
  )
}
