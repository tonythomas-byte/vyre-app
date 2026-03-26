'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import FooterNav from '@/components/FooterNav'
import styles from './journal.module.css'

export default function JournalPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

  const handleFooterNavigation = (destination: 'groups' | 'menu' | 'profile' | 'explore' | 'account') => {
    switch (destination) {
      case 'groups':  router.push('/groups');  break
      case 'menu':    router.push('/menu');    break
      case 'profile': router.push('/profile'); break
      case 'explore': router.push('/explore'); break
      case 'account': router.push('/account'); break
    }
  }

  const handleHeartbeatClick = () => console.log('Scribble mode (future)')
  const handleMusicClick = () => console.log('Audio (future)')
  const handleGalleryClick = () => console.log('Gallery (future)')

  return (
    <div className={styles.pageContainer}>
        <div className={styles.heroSection}>
          {/* Floral decoration behind character */}
          <div className={styles.floralBackground}>
            <Image
              src="/assets/icons/journal/floral under avatar.svg"
              alt="Floral decoration"
              width={280}
              height={280}
              className={styles.floralImage}
            />
          </div>
          
          {/* Zen character */}
          <div className={styles.zenCharacter}>
            <Image
              src="/assets/images/landing/Zen_character.png"
              alt="Zen character"
              width={120}
              height={120}
              className={styles.characterImage}
            />
          </div>
          
          {/* Character shadow */}
          <div className={styles.characterShadow} />
        </div>

        {/* Journal Card */}
        <div className={styles.journalCard}>
          {/* Row 1: Title */}
          <div className={styles.inputRow}>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className={styles.titleInput}
              rows={1}
            />
            <button 
              className={styles.micButton}
              aria-label="Voice input for title"
            >
              <Image
                src="/assets/icons/common/microphone.svg"
                alt="Microphone"
                width={18}
                height={18}
              />
            </button>
          </div>

          {/* Divider Line */}
          <div className={styles.divider} />

          {/* Row 2: Notes */}
          <div className={styles.inputRow}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add Notes"
              className={styles.notesInput}
              rows={4}
            />
            <button 
              className={styles.micButton}
              aria-label="Voice input for notes"
            >
              <Image
                src="/assets/icons/common/microphone.svg"
                alt="Microphone"
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            className={styles.actionButton}
            onClick={handleHeartbeatClick}
            aria-label="Scribble mode"
          >
            <Image
              src="/assets/icons/journal/scribble.svg"
              alt="Scribble mode"
              width={16}
              height={16}
            />
          </button>

          <button
            className={styles.actionButton}
            onClick={handleMusicClick}
            aria-label="Music feature"
          >
            <Image
              src="/assets/icons/journal/audio.svg"
              alt="Audio"
              width={16}
              height={16}
            />
          </button>

          <button
            className={styles.actionButton}
            onClick={handleGalleryClick}
            aria-label="Gallery and emojis"
          >
            <Image
              src="/assets/icons/journal/gallery.svg"
              alt="Gallery"
              width={16}
              height={16}
            />
          </button>
        </div>

        {/* Footer Navigation */}
        <footer className={styles.footerSection}>
          <FooterNav onNavigate={handleFooterNavigation} />
        </footer>
      </div>
  )
}

