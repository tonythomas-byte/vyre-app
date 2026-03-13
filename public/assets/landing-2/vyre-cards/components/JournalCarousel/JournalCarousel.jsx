import React from 'react';
import styles from './JournalCarousel.module.css';

export default function JournalCarousel() {
  // Hardcoded mock data — will be replaced with props/API later
  const journalEntries = [
    {
      id: 1,
      status: 'In Progress',
      title: 'Morning Reflections',
      date: '12 Jan 2024',
      imageUrl: '/assets/landing-2/journal-1.png'
    },
    {
      id: 2,
      status: 'Completed',
      title: 'Evening Gratitude',
      date: '11 Jan 2024',
      imageUrl: '/assets/landing-2/journal-2.png'
    },
    {
      id: 3,
      status: 'New',
      title: 'Weekly Review',
      date: '10 Jan 2024',
      imageUrl: '/assets/landing-2/journal-3.png'
    }
  ];

  const currentIndex = 0; // Static for now — interaction comes later

  return (
    <div className={styles.journalCarousel}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <span className={styles.status}>{journalEntries[currentIndex].status}</span>
            <h3 className={styles.title}>{journalEntries[currentIndex].title}</h3>
            <div className={styles.dateRow}>
              <span className={styles.date}>{journalEntries[currentIndex].date}</span>
              <span className={styles.ellipse}>•••</span>
            </div>
          </div>
          <div className={styles.imageSection}>
            <div 
              className={styles.heroImage}
              style={{ backgroundImage: `url(${journalEntries[currentIndex].imageUrl})` }}
              role="img"
              aria-label={journalEntries[currentIndex].title}
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
  );
}
