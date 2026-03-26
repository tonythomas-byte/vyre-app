import React from 'react'
import Image from 'next/image'
import styles from './CompanionCard.module.css'

interface Companion {
  id: number
  name: string
  unlocked: boolean
  image?: string
}

interface CompanionCardProps {
  companion: Companion
  onClick: () => void
}

export default function CompanionCard({ companion, onClick }: CompanionCardProps) {
  return (
    <div 
      className={`${styles.card} ${!companion.unlocked ? styles.locked : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${companion.name} ${companion.unlocked ? 'unlocked' : 'locked'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {companion.image && (
        <div className={styles.imageWrapper}>
          <Image
            src={companion.image}
            alt={companion.name}
            fill
            className={styles.image}
          />
        </div>
      )}
      
      {!companion.unlocked && (
        <div className={styles.lockOverlay}>
          <span className={styles.lockIcon} aria-hidden="true">
            🔒
          </span>
        </div>
      )}
    </div>
  )
}
