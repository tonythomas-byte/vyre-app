import React from 'react'
import styles from './LandingBackground.module.css'

interface LandingBackgroundProps {
  children: React.ReactNode
}

export default function LandingBackground({ children }: LandingBackgroundProps) {
  return (
    <div className={styles.landing2Wrapper}>
      {children}
    </div>
  )
}
