'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import PillCard from '@/components/PillCard'
import styles from './treasure-pill.module.css'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(month: number, year: number) {
  // 0=Sun..6=Sat → convert to Mon-based (0=Mon..6=Sun)
  const day = new Date(year, month, 1).getDay()
  return (day + 6) % 7
}

export default function TreasurePillPage() {
  const router = useRouter()
  const [month, setMonth] = useState(0) // 0 = January
  const [year, setYear] = useState(2024)
  const [open, setOpen] = useState(false)

  const today = 15 // highlight demo

  const daysInMonth = getDaysInMonth(month, year)
  const firstDay = getFirstDayOfMonth(month, year)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <PageBackground>
      <div className={styles.page}>
        <button type="button" className={styles.back} onClick={() => router.push('/landing')}>
          Back to landing
        </button>

        {/* Month/year header */}
        <div className={styles.monthHeader}>
          <button type="button" className={styles.monthBtn} onClick={() => setOpen(o => !o)}>
            <span className={styles.monthLabel}>{MONTHS[month]} {year}</span>
            <span className={styles.dropArrow}>▾</span>
          </button>
        </div>

        {/* Click-outside backdrop */}
        {open && (
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
        )}

        {/* Calendar panel */}
        {open && (
          <div className={styles.calendarPanel}>
            <div className={styles.calNav}>
              <button type="button" className={styles.navBtn} onClick={prevMonth}>‹</button>
              <div className={styles.calTitle}>
                <div className={styles.calMonth}>{MONTHS[month]}</div>
                <div className={styles.calYear}>{year}</div>
              </div>
              <button type="button" className={styles.navBtn} onClick={nextMonth}>›</button>
            </div>

            <div className={styles.calGrid}>
              {DAYS.map(d => (
                <div key={d} className={styles.dayName}>{d}</div>
              ))}
              {cells.map((day, i) => (
                <div
                  key={i}
                  className={`${styles.dayCell} ${day === today ? styles.dayCellToday : ''} ${!day ? styles.dayCellEmpty : ''}`}
                >
                  {day ?? ''}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className={styles.entriesLabel}>Entries</p>

        <div className={`${styles.pillList} ${open ? styles.pillListPushed : ''}`}>
          <PillCard mood="Ecstatic" day="Sunday" date="February 8, 2026" />
          <PillCard mood="Awe" day="Monday" date="February 9, 2026" />
          <PillCard mood="Unique" day="Tuesday" date="February 10, 2026" />
          <PillCard mood="Nile" day="Wednesday" date="February 11, 2026" />
        </div>
      </div>
    </PageBackground>
  )
}
