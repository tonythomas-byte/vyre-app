'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  avatarVariants,
  floralVariants,
  shadowVariants,
  micVariants,
  cardVariants,
} from './hooks/useJournalTransition'
import styles from './journal.module.css'

interface JournalEntranceProps {
  title: string
  setTitle: (v: string) => void
  notes: string
  setNotes: (v: string) => void
}

export default function JournalEntrance({
  title,
  setTitle,
  notes,
  setNotes,
}: JournalEntranceProps) {
  const [phase, setPhase] = useState<'initial' | 'settled' | 'bounce'>('initial')

  useEffect(() => {
    const settleTimer = setTimeout(() => setPhase('settled'), 50)
    const bounceTimer = setTimeout(() => setPhase('bounce'), 400)
    return () => {
      clearTimeout(settleTimer)
      clearTimeout(bounceTimer)
    }
  }, [])

  return (
    <>
      <div className={styles.heroSection}>

        <motion.div
          className={styles.floralBackground}
          variants={floralVariants}
          initial="hidden"
          animate={phase === 'bounce' ? 'bounce' : phase === 'settled' ? 'visible' : 'hidden'}
          style={{ originX: 0.5, originY: 0.5, zIndex: 1 }}
        >
          <Image
            src="/assets/icons/journal/floral under avatar.svg"
            alt=""
            width={280}
            height={280}
            className={styles.floralImage}
          />
        </motion.div>

        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
        }}>
          <motion.div
            layoutId="zen-avatar"
            className={styles.zenCharacter}
            variants={avatarVariants}
            initial="initial"
            animate="settled"
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <Image
              src="/assets/images/landing/Zen_character.png"
              alt="Zen character"
              width={120}
              height={120}
              className={styles.characterImage}
            />
          </motion.div>

          <motion.img
            src="/assets/journal/vector.png"
            alt=""
            className={styles.characterShadow}
            variants={shadowVariants}
            initial="hidden"
            animate={phase === 'bounce' ? 'bounce' : phase === 'settled' ? 'visible' : 'hidden'}
            style={{ originX: 0.5, originY: 0.5 }}
          />
        </div>

      </div>

      <motion.div
        className={styles.journalCard}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.inputRow}>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className={styles.titleInput}
            rows={1}
          />
          <motion.button
            className={styles.micButton}
            aria-label="Voice input for title"
            variants={micVariants}
            initial="hidden"
            animate={phase === 'bounce' ? 'bounce' : phase === 'settled' ? 'visible' : 'hidden'}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <Image src="/assets/icons/common/microphone.svg" alt="Microphone" width={18} height={18} />
          </motion.button>
        </div>

        <div className={styles.divider} />

        <div className={styles.inputRow}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add Notes"
            className={styles.notesInput}
            rows={4}
          />
          <motion.button
            className={styles.micButton}
            aria-label="Voice input for notes"
            variants={micVariants}
            initial="hidden"
            animate={phase === 'bounce' ? 'bounce' : phase === 'settled' ? 'visible' : 'hidden'}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <Image src="/assets/icons/common/microphone.svg" alt="Microphone" width={18} height={18} />
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
