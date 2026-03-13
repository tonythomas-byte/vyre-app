'use client'

import styles from './DecorativeFloras.module.css'

export default function DecorativeFloras() {
  return (
    <>
      {/* Top floral - above arch (z-index: 2) but behind avatar */}
      <div className={styles.heroDecorativeLayer} style={{ zIndex: 2 }}>
        <img
          src="/assets/landing-2/decorative/top under hero avatar.png"
          alt=""
          className={styles.topUnderAvatarImage}
        />
      </div>

      {/* Other florals - behind everything (z-index: 1) */}
      <div className={styles.pageDecorativeLayer}>
        {/* Left Middle */}
        <img
          src="/assets/landing-2/decorative/left middle.png"
          alt=""
          className={styles.leftMiddleImage}
        />
        
        {/* Right Middle */}
        <img
          src="/assets/landing-2/decorative/right middle.png"
          alt=""
          className={styles.rightMiddleImage}
        />
        
        {/* Bottom Middle */}
        <img
          src="/assets/landing-2/decorative/bottom middle.png"
          alt=""
          className={styles.bottomMiddleImage}
        />
      </div>
    </>
  )
}