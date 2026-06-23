'use client'

import { Suspense } from 'react'
import SavePillScene from './SavePillScene'

export default function SavePillPage() {
  return (
    <Suspense fallback={null}>
      <SavePillScene />
    </Suspense>
  )
}
