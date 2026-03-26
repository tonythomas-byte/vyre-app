'use client'

import styles from './DecorativeFloras.module.css'

export default function DecorativeFloras() {
  return (
    <>
      {/* Top floral - above arch (z-index: 2) but behind avatar */}
      <div className={styles.heroDecorativeLayer} style={{ zIndex: 2 }}>
        <img
          src="/assets/images/landing/top under hero avatar.png"
          alt=""
          className={styles.topUnderAvatarImage}
        />
      </div>

      {/* Other florals - behind everything (z-index: 1) */}
      <div className={styles.pageDecorativeLayer}>
        {/* Left Middle */}
        <img
          src="/assets/images/landing/left middle.png"
          alt=""
          className={styles.leftMiddleImage}
        />
        
        {/* Right Middle */}
        <img
          src="/assets/images/landing/right middle.png"
          alt=""
          className={styles.rightMiddleImage}
        />
        
        {/* Bottom Middle */}
        <img
          src="/assets/images/landing/bottom middle.png"
          alt=""
          className={styles.bottomMiddleImage}
        />
      </div>
    </>
  )
}