'use client'

import Image from 'next/image'
import styles from './TreasurePillLeft.module.css'

const HALF_W = 179
const PILL_H = 160

type TreasurePillLeftProps = {
  className?: string
}

/** Left 50%: Buddha / Frame.svg — separate surface for “break pill” animation. */
export function TreasurePillLeft({ className }: TreasurePillLeftProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <Image
        src="/assets/illustrations/landing/Frame.svg"
        alt=""
        width={HALF_W}
        height={PILL_H}
        className={styles.frame}
        sizes="(max-width: 400px) 45vw, 179px"
        priority
      />
    </div>
  )
}
