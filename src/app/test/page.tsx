'use client'

import React, { useState } from 'react'
import MoodSelectorTest from '@/components/MoodSelectorTest'
import type { MoodType } from '@/components/MoodSelectorTest'

export default function TestPage() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [canContinue, setCanContinue] = useState(false)

  const handleMoodSelect = (mood: MoodType | null) => {
    setSelectedMood(mood)
  }

  const handleFirstSwipe = () => {
    setCanContinue(true)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>
        Circular Motion Test
      </h1>
      
      <MoodSelectorTest 
        onMoodSelect={handleMoodSelect}
        onFirstSwipe={handleFirstSwipe}
      />

      <div style={{ marginTop: '2rem', color: 'white' }}>
        <p>Selected Mood: {selectedMood || 'None'}</p>
        <p>Can Continue: {canContinue ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}
