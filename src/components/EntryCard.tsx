'use client'

import Image from 'next/image'
import styles from './EntryCard.module.css'

interface EntryCardProps {
  dayLabel: string        // e.g. "Mo"
  dateNumber: number      // e.g. 15
  thumbnail: string       // circular image path
  title: string
  time: string            // e.g. "10:30 am"
  description: string
  color?: 'pink' | 'blue' | 'purple'
  moodAvatar: string      // mood avatar for this entry (shown above card)
  dateMoodAvatars: string[] // all mood avatars for this date (shown bottom-right)
}

export default function EntryCard({
  dayLabel,
  dateNumber,
  thumbnail,
  title,
  time,
  description,
  color = 'pink',
  moodAvatar,
  dateMoodAvatars,
}: EntryCardProps) {
  return (
    <div className={styles.row}>

      {/* Left — day label */}
      <div className={styles.dayCol}>
        <span className={styles.dayLabel}>{dayLabel}</span>
        <span className={styles.dateNumber}>{dateNumber}</span>
      </div>

      {/* Card wrapper */}
      <div className={styles.cardWrapper}>

        {/* Mood avatar — sits behind card, bottom half overlaps top-left */}
        <div className={styles.avatarAbove}>
          <Image
            src={moodAvatar}
            alt="mood"
            width={48}
            height={48}
            className={styles.avatarAboveImg}
          />
        </div>

        {/* Card */}
        <div className={`${styles.card} ${styles[color]}`}>

          {/* Left: circular thumbnail */}
          <div className={styles.thumbnail}>
            <Image
              src={thumbnail}
              alt={title}
              fill
              className={styles.thumbnailImg}
            />
          </div>

          {/* Vertical divider */}
          <div className={styles.divider} />

          {/* Right: text block */}
          <div className={styles.textBlock}>
            <p className={styles.title}>{title}</p>
            <p className={styles.time}>{time}</p>
            <p className={styles.description}>{description}</p>
          </div>

          {/* Bottom-right: overlapping mood avatars for this date */}
          <div className={styles.avatarPair}>
            {dateMoodAvatars.slice(0, 4).map((src, i) => {
              const sizes = [34, 28, 22, 18]
              const size = sizes[i] ?? 18
              const total = Math.min(dateMoodAvatars.length, 4)
              return (
                <div
                  key={i}
                  className={styles.avatarCircle}
                  style={{
                    width: size,
                    height: size,
                    zIndex: total - i,
                    marginLeft: i === 0 ? 0 : -9,
                  }}
                >
                  <Image src={src} alt="" fill className={styles.avatarImg} />
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
