import React from 'react'
import styles from './Landing2Background.module.css'

interface Landing2BackgroundProps {
  children: React.ReactNode
}

/**
 * Wrapper component that overrides only the background gradient
 * for the landing-2 page while preserving all other PageBackground functionality
 */
export default function Landing2Background({ children }: Landing2BackgroundProps) {
  return (
    <div className={styles.landing2Wrapper}>
      {children}
    </div>
  )
}