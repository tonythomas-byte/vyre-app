import Image from 'next/image'
import styles from './PageBackground.module.css'

interface PageBackgroundProps {
  children: React.ReactNode
}

export default function PageBackground({ children }: PageBackgroundProps) {
  return (
    <div className={styles.backgroundContainer}>
      {/* Glassmorphism overlay covering entire page */}
      <div className={styles.glassmorphismOverlay}></div>
      
      {/* Flower carpet decorations */}
      <div className={styles.flowerCarpetLeft}>
        <Image 
          src="/assets/illustrations/landing/c1.svg" 
          alt="Flower carpet decoration" 
          width={120} 
          height={120}
          priority
        />
      </div>
      
      <div className={styles.flowerCarpetRight}>
        <Image 
          src="/assets/illustrations/landing/c2.svg" 
          alt="Flower carpet decoration" 
          width={120} 
          height={120}
          priority
        />
      </div>
     {/* Layer 2: Glassmorphism overlay (z-index: 1) */}
      <div className={styles.glassmorphismOverlay}></div>
      
      {/* Layer 3: Content wrapper with children (z-index: 10) */}
      <div className={styles.contentWrapper}>
        {children}
      </div>
    </div>
  )
}