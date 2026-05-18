'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './summary.module.css'
import SavePillAnimation from '@/components/SavePillAnimation'

export default function JournalSummaryPage() {
  const router = useRouter()
  const [title,      setTitle]      = useState('')
  const [notes,      setNotes]      = useState('')
  const [time,       setTime]       = useState('')
  const [feeling,    setFeeling]    = useState('eccentric')
  const [showAnim,   setShowAnim]   = useState(false)

  useEffect(() => {
    // Read journal entry from sessionStorage
    const raw = sessionStorage.getItem('journalEntry')
    if (raw) {
      const data = JSON.parse(raw)
      setTitle(data.title   || 'Wacken')
      setNotes(data.notes   || 'The stars you see might have already exploded millions of years ago...\nbut their light is still reaching your eyes only now.')
      setFeeling(data.feeling || 'eccentric')
    } else {
      setTitle('Wacken')
      setNotes('The stars you see might have already exploded millions of years ago...\nbut their light is still reaching your eyes only now.')
    }

    // Set current time and keep it updated
    const fmt = () => {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      setTime(`${h}:${m}`)
    }
    fmt()
    const interval = setInterval(fmt, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.pageContainer}>

      {/* VYRE oversized header */}
      <div className={styles.vyreHeader} aria-hidden="true">
        <Image src="/assets/icons/journal/headerjournal.svg" alt="" width={600} height={120} className={styles.vyreImg} />
      </div>

      {/* Hero — zen character */}
      <div className={styles.heroSection}>
        <div className={styles.floralBackground}>
          <Image
            src="/assets/icons/journal/floral under avatar.svg"
            alt=""
            width={140}
            height={140}
            className={styles.floralImage}
          />
        </div>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
          <div className={styles.zenCharacter}>
            <Image
              src="/assets/images/landing/Zen_character.png"
              alt="Zen character"
              width={120}
              height={120}
              className={styles.characterImage}
            />
          </div>
          <img src="/assets/journal/vector.png" alt="" className={styles.characterShadow} />
        </div>
      </div>

      {/* Content card */}
      <div className={styles.cardWrapper}>
        <div className={styles.timeBadge}>{time}</div>
        <div className={styles.contentCard}>
          <h1 className={styles.titleText}>{title || 'Untitled'}</h1>
          <div className={styles.cardDivider} />
          <p className={styles.notesText}>{notes || 'No notes added.'}</p>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.continueBtn} onClick={() => router.push('/landing')}>
          Continue
        </button>
        <button className={styles.savePillBtn} onClick={() => setShowAnim(true)}>
          Save pill
        </button>
      </div>

      {showAnim && (
        <SavePillAnimation
          mood={title || 'Ecstatic'}
          day="Sunday"
          date="February 8, 2026"
          feeling={feeling}
          onComplete={() => router.push('/landing')}
        />
      )}

    </div>
  )
}
