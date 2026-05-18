'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './pill-detail.module.css'
import CalendarIcon from '@/components/CalendarIcon'

const SLIDER_MOODS = [
  { name: 'angry',    avatar: '/assets/illustrations/onboarding/avatar/angry.png',    label: 'Feeling intense'  },
  { name: 'sad',      avatar: '/assets/illustrations/onboarding/avatar/sad.png',      label: 'Still processing' },
  { name: 'happy',    avatar: '/assets/illustrations/onboarding/avatar/happy.png',    label: 'A bit better'     },
  { name: 'cry',      avatar: '/assets/illustrations/onboarding/avatar/cry.png',      label: 'Quite emotional'  },
  { name: 'confused', avatar: '/assets/illustrations/onboarding/avatar/confused.png', label: 'Not sure yet'     },
]

function PillDetailContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const mood = searchParams.get('mood') || ''
  const day  = searchParams.get('day')  || ''
  const date = searchParams.get('date') || ''

  const [sliderIndex,    setSliderIndex]    = useState(2)
  const [reflection,     setReflection]     = useState('')
  const [upperFadeOut,   setUpperFadeOut]   = useState(false)
  const [upperBlurred,   setUpperBlurred]   = useState(false)
  const [lowerAtBottom,  setLowerAtBottom]  = useState(false)
  const [lowerFadingOut, setLowerFadingOut] = useState(false)
  const [lowerAtCenter,  setLowerAtCenter]  = useState(false)
  const [auroraVisible,  setAuroraVisible]  = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const fillPercent = (sliderIndex / (SLIDER_MOODS.length - 1)) * 100

  useEffect(() => {
    // Phase 1 — lower card slides up from bottom, frosted overlay visible
    // Small delay to let page paint first
    const t1 = setTimeout(() => {
      setUpperBlurred(true)
      setLowerAtBottom(true)
    }, 80)

    let t3: ReturnType<typeof setTimeout>
    let t4: ReturnType<typeof setTimeout>

    const t2 = setTimeout(() => {
      setUpperFadeOut(true)
      setUpperBlurred(false)

      // Fade out lower card at bottom position + aurora slides up simultaneously
      setLowerAtBottom(false)
      setLowerFadingOut(true)
      setAuroraVisible(true)

      // After cards fade out (400ms), bring lower card to center
      t3 = setTimeout(() => {
        setLowerFadingOut(false)
        // Step 3: fade in at center
        t4 = setTimeout(() => {
          setLowerAtCenter(true)
        }, 50)
      }, 400)
    }, 1000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [])

  const handleTextareaInput = () => {
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px` }
  }

  return (
    <div className={styles.page}>

      {/* Aurora gradient — rises from bottom during transition */}
      <div className={`${styles.auroraGradient} ${auroraVisible ? styles.visible : ''}`} />

      {/* Upper card */}
      <div className={`${styles.upperCard} ${upperBlurred ? styles.blurred : ''} ${upperFadeOut ? styles.fadeOut : ''}`}>
        <div className={styles.calIconWrapper}>
          <CalendarIcon day={day} date={date} size={90} fontSize={10} />
        </div>
        <p className={styles.moodTitle}>{mood}</p>
        <Image src="/assets/illustrations/landing/player.svg" alt=""
          width={174} height={224} className={styles.playerImg} />
        <p className={styles.songLabel}>Song from this moment</p>
        <p className={styles.songName}>Happy - Pharrell Williams</p>
      </div>

      {/* Lower card — starts at bottom, moves to center */}
      <div className={`${styles.lowerCard} ${lowerAtCenter ? styles.atCenter : lowerFadingOut ? styles.fadingOut : lowerAtBottom ? styles.atBottom : ''}`}>

        {/* Avatar slider */}
        <div className={styles.sliderSection}>
          <div className={styles.avatarRow}>
            {SLIDER_MOODS.map((m, i) => (
              <button key={m.name} className={styles.avatarBtn}
                onClick={() => setSliderIndex(i)} aria-label={m.name}>
                <Image src={m.avatar} alt={m.name} width={62} height={62}
                  className={styles.avatarImg} />
              </button>
            ))}
          </div>
          <div className={styles.trackWrapper}>
            <div className={styles.thumbAvatar}
                 style={{ left: `calc(${(sliderIndex / 4) * 100}% - 31px)` }}>
              <Image src={SLIDER_MOODS[sliderIndex].avatar}
                alt={SLIDER_MOODS[sliderIndex].name} width={62} height={62}
                className={styles.thumbImg} />
            </div>
            <div className={styles.trackBg}>
              <div className={styles.trackFill} style={{ width: `${fillPercent}%` }} />
            </div>
            <input type="range" min={0} max={4} step={1} value={sliderIndex}
              onChange={e => setSliderIndex(Number(e.target.value))}
              className={styles.rangeInput} aria-label="Mood slider" />
          </div>
        </div>

        {/* Question */}
        <div className={styles.questionSection}>
          <h2 className={styles.question}>How has life been since then?</h2>
          <p className={styles.responseLabel}>{SLIDER_MOODS[sliderIndex].label}</p>
        </div>

        {/* Text input */}
        <textarea ref={textareaRef} value={reflection}
          onChange={e => setReflection(e.target.value)}
          onInput={handleTextareaInput}
          placeholder="How have things changed? What have you learned? How do you feel looking back?"
          className={styles.textInput} rows={3} />

        {/* Save */}
        <div className={styles.ctaWrapper}>
          <button className={styles.saveBtn} onClick={() => router.push('/treasure-pill')}>
            Save Reflection
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PillDetailPage() {
  return (
    <Suspense fallback={null}>
      <PillDetailContent />
    </Suspense>
  )
}
