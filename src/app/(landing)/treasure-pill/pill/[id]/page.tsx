'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import styles from './reflect.module.css'
import CalendarIcon from '@/components/CalendarIcon'

const SWIPE_THRESHOLD = 60
const SWIPE_DISMISS   = 30

interface TransitionState {
  from: string
  cardTop: number
  cardLeft: number
  cardWidth: number
  cardHeight: number
  timestamp: number
}

function ReflectContent() {
  const router       = useRouter()
  const params       = useParams()
  const searchParams = useSearchParams()
  const mood = searchParams.get('mood') || ''
  const day  = searchParams.get('day')  || ''
  const date = searchParams.get('date') || ''

  const cardRef    = useRef<HTMLDivElement>(null)
  const touchStart = useRef<number>(0)
  const swiping    = useRef(false)

  const [noteText,       setNoteText]       = useState('')
  const [showAbove,      setShowAbove]      = useState(false)
  const [aboveLooping,   setAboveLooping]   = useState(false)
  const [showContent,    setShowContent]    = useState(false)
  const [showBottom,     setShowBottom]     = useState(false)
  const [revealFadeOut,  setRevealFadeOut]  = useState(false)
  const [showReveal,     setShowReveal]     = useState(false)

  // ── Entry animation ───────────────────────────────────────────
  useEffect(() => {
    const raw  = sessionStorage.getItem('pillTransition')
    const card = cardRef.current
    if (!card) return

    if (!raw) {
      setShowAbove(true)
      setAboveLooping(true)
      setShowContent(true)
      setShowBottom(true)
      return
    }    const state: TransitionState = JSON.parse(raw)
    sessionStorage.removeItem('pillTransition')

    if (Date.now() - state.timestamp > 5000) {
      setShowAbove(true)
      setAboveLooping(true)
      setShowContent(true)
      setShowBottom(true)
      return
    }

    // Diamond + "3 left" visible immediately
    setShowAbove(true)
    setShowReveal(true)

    requestAnimationFrame(() => {
      const cardRect = card.getBoundingClientRect()

      // Clip to a 0×0 point at the top-left corner of the reveal card
      const clipTop    = state.cardTop  - cardRect.top
      const clipLeft   = state.cardLeft - cardRect.left
      const clipRight  = cardRect.right  - state.cardLeft   // everything right of the point
      const clipBottom = cardRect.bottom - state.cardTop    // everything below the point

      const startClip = `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px round 24px)`
      const endClip   = `inset(0px 0px 0px 0px round 32px)`

      // Lock card to 0×0 point, show content hidden inside
      card.style.transition = 'none'
      card.style.clipPath   = startClip
      setShowContent(true)
      void card.offsetHeight

      // Start fade + expansion immediately (no pause)
      setTimeout(() => {
        setRevealFadeOut(true)

        card.style.transition = 'clip-path 1500ms cubic-bezier(0.4, 0, 0.2, 1)'
        card.style.clipPath   = endClip

        // After expansion completes
        setTimeout(() => {
          card.style.clipPath   = ''
          card.style.transition = ''
          setShowBottom(true)
          setAboveLooping(true)
        }, 1550)
      }, 0)
    })
  }, [])

  // ── Navigate to detail page, passing note text ────────────────
  const navigate = () => {
    const id   = Array.isArray(params.id) ? params.id[0] : (params.id ?? '1')
    const card = cardRef.current
    if (card) {
      card.style.transition = 'transform 300ms ease-in, opacity 300ms ease-in'
      card.style.transform  = 'translateY(-110%)'
      card.style.opacity    = '0'
    }
    setTimeout(() => {
      router.push(
        `/treasure-pill/pill/${id}/detail?mood=${encodeURIComponent(mood)}&day=${encodeURIComponent(day)}&date=${encodeURIComponent(date)}&note=${encodeURIComponent(noteText)}`
      )
    }, 280)
  }

  // ── Swipe gesture ─────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY
    swiping.current    = true
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!swiping.current) return
    const card  = cardRef.current
    if (!card) return
    const delta = touchStart.current - e.touches[0].clientY
    if (delta > 0) {
      const drag = Math.min(delta, SWIPE_DISMISS + (delta - SWIPE_DISMISS) * 0.2)
      card.style.transition = 'none'
      card.style.transform  = `translateY(-${drag}px)`
    }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!swiping.current) return
    swiping.current = false
    const card  = cardRef.current
    if (!card) return
    const delta = touchStart.current - e.changedTouches[0].clientY
    if (delta >= SWIPE_THRESHOLD) {
      navigate()
    } else {
      card.style.transition = 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)'
      card.style.transform  = 'translateY(0)'
    }
  }

  return (
    <div className={styles.page}>

      {/* Reveal card shell — only shown during pill transition, fades out immediately */}
      {showReveal && (
        <div className={`${styles.revealShell} ${revealFadeOut ? styles.fadeOut : ''}`} aria-hidden="true" />
      )}

      {/* Diamond gem icon */}
      <div className={`${styles.diamondWrapper} ${showAbove ? '' : styles.hidden}`}>
        <Image
          src="/assets/illustrations/treasure-pill-reflect/Group 4.png"
          alt="Diamond gem"
          width={96}
          height={96}
          className={`${styles.diamond} ${aboveLooping ? styles.visible : ''}`}
          priority
        />
      </div>

      {/* "3 left" */}
      <p
        className={`${styles.leftCount} ${showAbove ? '' : styles.hidden} ${aboveLooping ? styles.visible : ''}`}
      >
        3 left
      </p>

      {/* Main card */}
      <div
        ref={cardRef}
        className={styles.card}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.blueBlob} aria-hidden="true" />
        <div className={styles.pinkGlow} aria-hidden="true" />

        {/* Header */}
        <div className={`${styles.headerRow} ${showContent ? styles.fadeIn : styles.hidden}`}>
          <div className={styles.calIconWrapper}>
            <CalendarIcon day={day} date={date} size={110} fontSize={10} />
          </div>
          <p className={styles.moodTitle}>{mood}</p>
        </div>

        {/* Decorative player */}
        <Image
          src="/assets/illustrations/landing/player.svg"
          alt=""
          width={160}
          height={200}
          className={`${styles.playerImg} ${showContent ? styles.fadeIn : styles.hidden}`}
          style={{ animationDelay: '60ms' }}
        />

        {/* Song info */}
        <div
          className={`${styles.songSection} ${showContent ? styles.fadeIn : styles.hidden}`}
          style={{ animationDelay: '120ms' }}
        >
          <p className={styles.songLabel}>Song from this moment</p>
          <p className={styles.songName}>Happy - Pharrell Williams</p>
        </div>

        {/* Bottom group */}
        <div className={`${styles.bottomGroup} ${showBottom ? styles.slideUp : styles.hidden}`}>

          {/* Editable note box — user types reason for emotion */}
          <textarea
            className={styles.noteBox}
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Got my dream job offer today! This is the best day ever!"
            rows={3}
            aria-label="Reason for emotion"
          />

          <h2
            className={`${styles.reflectHeading} ${showBottom ? styles.fadeIn : styles.hidden}`}
            style={{ animationDelay: '100ms' }}
          >
            Take a moment to reflect
          </h2>

          <button
            className={`${styles.swipeHint} ${showBottom ? styles.fadeIn : styles.hidden}`}
            style={{ animationDelay: '200ms' }}
            onClick={navigate}
            aria-label="Swipe up to reflect"
          >
            <span className={styles.swipeCaret}>^</span>
            <span className={styles.swipeText}>Swipe to reflect</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReflectPage() {
  return (
    <Suspense fallback={null}>
      <ReflectContent />
    </Suspense>
  )
}
