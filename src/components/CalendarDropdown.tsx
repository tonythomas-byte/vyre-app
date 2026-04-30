'use client'

import { useState } from 'react'
import styles from './CalendarDropdown.module.css'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(month: number, year: number) {
  const day = new Date(year, month, 1).getDay()
  return (day + 6) % 7
}

interface CalendarDropdownProps {
  initialMonth?: number
  initialYear?: number
  highlightDay?: number
  onDateSelect: (date: string) => void
  onOpenChange?: (open: boolean) => void
}

export default function CalendarDropdown({
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear(),
  highlightDay,
  onDateSelect,
  onOpenChange,
}: CalendarDropdownProps) {
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)
  const [open, setOpen] = useState(false)

  const toggleOpen = (val: boolean) => {
    setOpen(val)
    onOpenChange?.(val)
  }

  const daysInMonth = getDaysInMonth(month, year)
  const firstDay = getFirstDayOfMonth(month, year)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setOpen(false)
    onOpenChange?.(false)
    onDateSelect(dateStr)
  }

  return (
    <div className={styles.wrapper}>
      {/* Month/year trigger button */}
      <div className={styles.monthHeader}>
        <button type="button" className={styles.monthBtn} onClick={() => toggleOpen(!open)}>
          <span className={styles.monthLabel}>{MONTHS[month]} {year}</span>
          <span className={styles.dropArrow}>▾</span>
        </button>
      </div>

      {/* Backdrop */}
      {open && <div className={styles.backdrop} onClick={() => toggleOpen(false)} />}

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
                className={`${styles.dayCell} ${day === highlightDay ? styles.dayCellToday : ''} ${!day ? styles.dayCellEmpty : ''}`}
                onClick={() => day && handleDayClick(day)}
              >
                {day ?? ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
