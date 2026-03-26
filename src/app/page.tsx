'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PageBackground from '@/components/PageBackground'
import styles from './landing.module.css'

export default function Home() {
  const router = useRouter()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    // Stage timings in multiples of 150ms
    const timer1 = setTimeout(() => setStage(1), 450)   // 3 × 150ms - RE appears faintly
    const timer2 = setTimeout(() => setStage(2), 1200)  // 8 × 150ms - Start final animation
    const timer3 = setTimeout(() => {
      router.push('/login') // Navigate after animation completes
    }, 2400) // 16 × 150ms - Total animation + pause
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [router])

  return (
    <PageBackground>
      <main className={styles.container} role="main" aria-label="VYRE logo animation">
        {/* Logo animation */}
        <div 
          className={styles.logoWrapper} 
          role="img" 
          aria-label="VYRE company logo"
        >
          {/* V letter */}
          <div 
            className={`${styles.letter} ${styles.v} ${stage >= 2 ? styles.vAnimate : ''}`}
            aria-hidden="true"
          >
            <Image 
              src="/assets/illustrations/splash/Group.svg" 
              alt="" 
              width={203} 
              height={295} 
              priority 
            />
          </div>

          {/* Y letter */}
          <div 
            className={`${styles.letter} ${styles.y} ${stage >= 2 ? styles.yAnimate : ''}`}
            aria-hidden="true"
          >
            <Image 
              src="/assets/illustrations/splash/Group-1.svg" 
              alt="" 
              width={190} 
              height={295} 
              priority 
            />
          </div>

          {/* RE letters */}
          <div 
            className={`${styles.letter} ${styles.re} ${stage >= 1 ? styles.reVisible : ''} ${stage >= 2 ? styles.reAnimate : ''}`}
            aria-hidden="true"
          >
            <Image 
              src="/assets/illustrations/splash/Group-2.svg" 
              alt="" 
              width={347} 
              height={295} 
              priority 
            />
          </div>
        </div>
      </main>
    </PageBackground>
  )
}
