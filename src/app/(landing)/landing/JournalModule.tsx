'use client'

import React from 'react'
import styles from './JournalModule.module.css'

interface JournalEntry {
  id: number
  status: string
  title: string
  date: string
  summary: string
  imageUrl: string
}

interface JournalModuleProps {
  entries?: JournalEntry[]
  currentIndex?: number
}

export default function JournalModule({
  entries,
  currentIndex = 0
}: JournalModuleProps) {
  const defaultEntries: JournalEntry[] = [
    {
      id: 1,
      status: 'Done and dusted',
      title: 'In to the Abyss',
      date: '25/10/2025',
      summary: 'Today I woke up feeling grateful for the small moments that bring joy...',
      imageUrl: '/assets/images/landing/jcard_background.png'
    },
    {
      id: 2,
      status: 'Completed',
      title: 'Evening Gratitude',
      date: '11 Jan 2024',
      summary: 'Reflecting on three things that made me smile today and the lessons learned...',
      imageUrl: '/assets/images/landing/jcard_background.png'
    },
    {
      id: 3,
      status: 'New',
      title: 'Weekly Review',
      date: '10 Jan 2024',
      summary: 'Looking back at this week\'s journey and setting intentions for the days ahead...',
      imageUrl: '/assets/images/landing/jcard_background.png'
    }
  ]

  const journalEntries = entries || defaultEntries
  const activeEntry = journalEntries[currentIndex] || journalEntries[0]

  return (
    <div className={styles.journalModule}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <span className={styles.status}>{activeEntry.status}</span>
            <h3 className={styles.title}>{activeEntry.title}</h3>
            <div className={styles.dateBlob}>
              <span className={styles.date}>{activeEntry.date}</span>
            </div>
          </div>
          <div className={styles.imageSection}>
            <div
              className={styles.heroImage}
              style={{ backgroundImage: `url(${activeEntry.imageUrl})` }}
              role="img"
              aria-label={activeEntry.title}
            />
          </div>
        </div>
      </div>

      <div className={styles.pagination}>
        {journalEntries.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
