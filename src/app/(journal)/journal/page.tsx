'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import JournalEntrance from './JournalEntrance'
import styles from './journal.module.css'

export default function JournalPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

  const handleHeartbeatClick = () => console.log('Scribble mode (future)')
  const handleMusicClick     = () => console.log('Audio (future)')
  const handleGalleryClick   = () => console.log('Gallery (future)')

  return (
    <div className={styles.pageContainer}>

      <JournalEntrance
        title={title}
        setTitle={setTitle}
        notes={notes}
        setNotes={setNotes}
      />

      <div className={styles.actionButtons}>
        <button className={styles.actionButton} onClick={handleHeartbeatClick} aria-label="Scribble mode">
          <Image src="/assets/icons/journal/scribble.svg" alt="Scribble mode" width={16} height={16} />
        </button>
        <button className={styles.actionButton} onClick={handleMusicClick} aria-label="Music feature">
          <Image src="/assets/icons/journal/audio.svg" alt="Audio" width={16} height={16} />
        </button>
        <button className={styles.actionButton} onClick={handleGalleryClick} aria-label="Gallery and emojis">
          <Image src="/assets/icons/journal/gallery.svg" alt="Gallery" width={16} height={16} />
        </button>
      </div>

    </div>
  )
}
