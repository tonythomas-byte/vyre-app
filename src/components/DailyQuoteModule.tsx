'use client'

import React from 'react'
import styles from './DailyQuoteModule.module.css'

interface DailyQuote {
  quote: string
  author?: string
}

interface DailyQuoteModuleProps {
  quote?: DailyQuote
}

export default function DailyQuoteModule({ quote }: DailyQuoteModuleProps) {
  // Default mock data following the documentation pattern
  const defaultQuote: DailyQuote = {
    quote: 'The journey of a thousand miles begins with a single step',
    author: 'Lao Tzu'
  }

  const dailyQuote = quote || defaultQuote

  return (
    <div className={styles.dailyQuoteModule}>
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
  )
}