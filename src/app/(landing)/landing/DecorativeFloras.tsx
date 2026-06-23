'use client'

import styles from './DecorativeFloras.module.css'

interface DecorativeFlorasProps {
  rotating?:  boolean  // CW 45°
  resetting?: boolean  // CCW back to 0°
}

export default function DecorativeFloras({ rotating = false, resetting = false }: DecorativeFlorasProps) {
  const rotateClass = rotating
    ? styles.floraRotateCW
    : resetting
      ? styles.floraRotateCCW
      : ''

  return (
    <>
      {/* Top floral */}
      <div className={styles.heroDecorativeLayer} style={{ zIndex: 2 }}>
        <img
          src="/assets/images/landing/top_under_hero_avatar.png"
          alt=""
          className={`${styles.topUnderAvatarImage} ${rotateClass}`}
        />
      </div>

      {/* Other florals */}
      <div className={styles.pageDecorativeLayer}>
        <img
          src="/assets/images/landing/bottom_middle.png"
          alt=""
          className={`${styles.leftMiddleImage} ${rotateClass}`}
        />
        <img
          src="/assets/images/landing/bottom_middle.png"
          alt=""
          className={`${styles.rightMiddleImage} ${rotateClass}`}
        />
        <img
          src="/assets/images/landing/bottom_middle.png"
          alt=""
          className={`${styles.bottomMiddleImage} ${rotateClass}`}
        />
      </div>
    </>
  )
}
