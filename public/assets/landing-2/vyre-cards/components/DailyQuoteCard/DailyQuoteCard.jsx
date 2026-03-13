import React from 'react';
import styles from './DailyQuoteCard.module.css';

export default function DailyQuoteCard() {
  // Hardcoded mock data — single quote display
  const dailyQuote = {
    quote: 'The journey of a thousand miles begins with a single step',
    author: 'Lao Tzu'
  };

  return (
    <div className={styles.dailyQuoteCard}>
      <div className={styles.card}>
        <div className={styles.content}>
          <span className={styles.quoteMark}>"</span>
          <blockquote className={styles.quote}>
            "{dailyQuote.quote}"
          </blockquote>
          {dailyQuote.author && (
            <cite className={styles.author}>— {dailyQuote.author}</cite>
          )}
          <span className={styles.arrow}>↗</span>
        </div>
      </div>
    </div>
  );
}
