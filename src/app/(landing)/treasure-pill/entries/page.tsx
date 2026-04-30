'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import EntryCard from '@/components/EntryCard'
import CalendarDropdown from '@/components/CalendarDropdown'
import styles from './entries.module.css'

// Mood avatar paths
const MOODS = {
  cry:      '/assets/illustrations/onboarding/avatar/cry.png',
  happy:    '/assets/illustrations/onboarding/avatar/happy.png',
  sad:      '/assets/illustrations/onboarding/avatar/sad.png',
  confused: '/assets/illustrations/onboarding/avatar/confused.png',
  angry:    '/assets/illustrations/onboarding/avatar/angry.png',
}

// Carousel order — moods sorted in this fixed sequence
const CAROUSEL_ORDER = ['sad', 'happy', 'cry', 'confused', 'angry'] as const

// Returns unique moods sorted by carousel order
function sortedMoods(moods: string[]): string[] {
  const unique = [...new Set(moods)]
  return unique.sort((a, b) => {
    const aKey = Object.entries(MOODS).find(([, v]) => v === a)?.[0] || ''
    const bKey = Object.entries(MOODS).find(([, v]) => v === b)?.[0] || ''
    return CAROUSEL_ORDER.indexOf(aKey as typeof CAROUSEL_ORDER[number]) -
           CAROUSEL_ORDER.indexOf(bKey as typeof CAROUSEL_ORDER[number])
  })
}
// dateMoodAvatars = all unique moods for that date
// Mock entries — each entry has its own moodAvatar
const MOCK_ENTRIES = [
  {
    id: 1, date: '2026-02-10', dayLabel: 'Tu',  dateNumber: 10,
    thumbnail: '/assets/images/landing/dailytcard.png',
    title: 'Morning Reflection', time: '08:00 am', description: 'Started the day with gratitude',
    color: 'purple' as const,
    moodAvatar: MOODS.happy,
    dateMoodAvatars: sortedMoods([MOODS.happy]),
  },
  {
    id: 2, date: '2026-02-11', dayLabel: 'Wed', dateNumber: 11,
    thumbnail: '/assets/images/landing/cardbackground.png',
    title: 'Midweek Check-in', time: '09:15 am', description: 'Feeling balanced and focused',
    color: 'blue' as const,
    moodAvatar: MOODS.happy,
    dateMoodAvatars: sortedMoods([MOODS.happy]),
  },
  {
    id: 3, date: '2026-02-12', dayLabel: 'Th',  dateNumber: 12,
    thumbnail: '/assets/images/landing/jcard_background.png',
    title: 'Creative Flow', time: '11:00 am', description: 'Ideas kept coming all day',
    color: 'pink' as const,
    moodAvatar: MOODS.happy,
    dateMoodAvatars: sortedMoods([MOODS.happy]),
  },
  {
    id: 4, date: '2026-02-13', dayLabel: 'Fr',  dateNumber: 13,
    thumbnail: '/assets/images/landing/dailytcard.png',
    title: 'Paths of Glory', time: '13:00 pm', description: 'A timeless war film',
    color: 'purple' as const,
    moodAvatar: MOODS.happy,
    dateMoodAvatars: sortedMoods([MOODS.happy]),
  },
  // Feb 14 — two entries: happy + cry → sorted: happy, cry
  {
    id: 5, date: '2026-02-14', dayLabel: 'Sa',  dateNumber: 14,
    thumbnail: '/assets/images/landing/cardbackground.png',
    title: 'Fear Inoculum', time: '10:30 am', description: 'One of the greatest albums of all time',
    color: 'pink' as const,
    moodAvatar: MOODS.happy,
    dateMoodAvatars: sortedMoods([MOODS.happy, MOODS.cry]),
  },
  {
    id: 6, date: '2026-02-14', dayLabel: 'Sa',  dateNumber: 14,
    thumbnail: '/assets/images/landing/jcard_background.png',
    title: "DD's Piano Improvisation", time: '10:55 am', description: 'Notes hit hard',
    color: 'blue' as const,
    moodAvatar: MOODS.happy,
    dateMoodAvatars: sortedMoods([MOODS.happy, MOODS.cry]),
  },
  {
    id: 7, date: '2026-02-15', dayLabel: 'Su',  dateNumber: 15,
    thumbnail: '/assets/images/landing/dailytcard.png',
    title: 'Avg Morning in Norway', time: '09:00 am', description: 'Experiencing the pagan culture',
    color: 'purple' as const,
    moodAvatar: MOODS.happy,
    dateMoodAvatars: sortedMoods([MOODS.happy]),
  },
  {
    id: 8, date: '2026-02-16', dayLabel: 'Mo',  dateNumber: 16,
    thumbnail: '/assets/images/landing/cardbackground.png',
    title: 'Back to Routine', time: '08:30 am', description: 'Productive Monday energy',
    color: 'pink' as const,
    moodAvatar: MOODS.happy,
    dateMoodAvatars: sortedMoods([MOODS.happy]),
  },
  {
    id: 9, date: '2026-02-17', dayLabel: 'Tu',  dateNumber: 17,
    thumbnail: '/assets/images/landing/jcard_background.png',
    title: 'Evening Walk', time: '18:00 pm', description: 'Clear mind after the walk',
    color: 'blue' as const,
    moodAvatar: MOODS.happy,
    dateMoodAvatars: sortedMoods([MOODS.happy]),
  },
  {
    id: 10, date: '2026-02-18', dayLabel: 'Wed', dateNumber: 18,
    thumbnail: '/assets/images/landing/dailytcard.png',
    title: 'Deep Work Session', time: '10:00 am', description: 'Four hours of pure focus',
    color: 'purple' as const,
    moodAvatar: MOODS.happy,
    dateMoodAvatars: sortedMoods([MOODS.happy]),
  },
]

function EntriesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedDate = searchParams.get('date') || ''
  const anchorRef = useRef<HTMLDivElement>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Parse initial month/year from selected date
  const [selYear, selMonth, selDay] = selectedDate.split('-').map(Number)

  // Header label
  let headerLabel = 'Entries'
  if (selectedDate) {
    const monthName = new Date(`${selYear}-${String(selMonth).padStart(2,'0')}-01`).toLocaleString('default', { month: 'long' })
    headerLabel = `${monthName} ${selYear}`
  }

  // Scroll to selected date on mount
  useEffect(() => {
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }, [selectedDate])

  const anchorId = MOCK_ENTRIES.find(e => e.date === selectedDate)?.id

  const handleDateSelect = (date: string) => {
    setCalendarOpen(false)
    router.push(`/treasure-pill/entries?date=${date}`)
  }

  return (
    <PageBackground>
      <div className={styles.page}>

        <div className={styles.header}>
          <button className={styles.back} onClick={() => router.push('/treasure-pill')} aria-label="Back">
            ‹
          </button>
          {/* Calendar dropdown replaces static title */}
          <CalendarDropdown
            initialMonth={selMonth ? selMonth - 1 : undefined}
            initialYear={selYear || undefined}
            highlightDay={selDay || undefined}
            onDateSelect={handleDateSelect}
            onOpenChange={setCalendarOpen}
          />
          <span className={styles.entriesLabel}>Entries</span>
        </div>

        <div className={`${styles.entryList} ${calendarOpen ? styles.entryListPushed : ''}`}>
          {MOCK_ENTRIES.map(entry => (
            <div
              key={entry.id}
              ref={entry.id === anchorId ? anchorRef : undefined}
            >
              <EntryCard
                dayLabel={entry.dayLabel}
                dateNumber={entry.dateNumber}
                thumbnail={entry.thumbnail}
                title={entry.title}
                time={entry.time}
                description={entry.description}
                color={entry.color}
                moodAvatar={entry.moodAvatar}
                dateMoodAvatars={entry.dateMoodAvatars}
              />
            </div>
          ))}
        </div>

      </div>
    </PageBackground>
  )
}

export default function EntriesPage() {
  return (
    <Suspense fallback={null}>
      <EntriesContent />
    </Suspense>
  )
}
