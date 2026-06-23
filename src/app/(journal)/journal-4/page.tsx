'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './journal-4.module.css'

export default function Journal4Page() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

  const handleNavigateToSummary = () => {
    sessionStorage.setItem('journalEntry', JSON.stringify({ title, notes }))
    router.push('/journal/summary')
  }

  return (
    <div className={styles.pageContainer}>

      {/* Hero Section — same structure as journal-2 */}
      <div className={styles.heroSection}>
        <div className={styles.floralBackground}>
          <Image
            src="/assets/icons/journal/floral under avatar.svg"
            alt=""
            width={280}
            height={280}
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
          <img
            src="/assets/journal/vector.png"
            alt=""
            className={styles.characterShadow}
          />
        </div>
      </div>

      {/* Journal Card */}
      <div className={styles.journalCard}>

        {/* Activity — tag as superscript top-left, label below-left */}
        <div className={styles.sectionBlock}>
          <div className={styles.tag}>
            <Image
              src="/assets/icons/journal/material-symbols_work-sharp.svg"
              alt="Work"
              width={16}
              height={16}
              className={styles.tagIcon}
            />
            <span className={styles.tagText}>Work</span>
          </div>
          <h2 className={styles.sectionLabel}>Activity</h2>
        </div>

        {/* Gap between Activity and Feeling */}
        <div className={styles.sectionGap} />

        {/* Feeling — tag as superscript top-left, label below-left */}
        <div className={styles.sectionBlock}>
          <div className={styles.tag}>
            <Image
              src="/assets/icons/journal/Vector (1).svg"
              alt="Obscure"
              width={16}
              height={16}
              className={styles.tagIcon}
            />
            <span className={styles.tagText}>Obscure</span>
          </div>
          <h2 className={styles.sectionLabel}>Feeling</h2>
        </div>

        <div className={styles.divider} />

        {/* Title input */}
        <div className={styles.inputRow}>
          <textarea
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            className={styles.titleInput}
            rows={1}
          />
          <div className={styles.inputActions}>
            <button className={styles.iconBtn} aria-label="Scribble">
              <Image src="/assets/icons/journal/jscribble.svg" alt="Scribble" width={20} height={20} />
            </button>
            <button className={styles.iconBtn} aria-label="Voice input">
              <Image src="/assets/icons/common/microphone.svg" alt="Microphone" width={20} height={20} />
            </button>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Notes input */}
        <div className={styles.inputRow}>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add Notes"
            className={styles.notesInput}
            rows={4}
          />
          <div className={styles.inputActions}>
            <button className={styles.iconBtn} aria-label="Scribble">
              <Image src="/assets/icons/journal/jscribble.svg" alt="Scribble" width={20} height={20} />
            </button>
            <button className={styles.iconBtn} aria-label="Voice input">
              <Image src="/assets/icons/common/microphone.svg" alt="Microphone" width={20} height={20} />
            </button>
          </div>
        </div>

        <div className={styles.divider} />

        <button className={styles.nextBtn} onClick={handleNavigateToSummary}>
          Next
        </button>

      </div>
    </div>
  )
}
