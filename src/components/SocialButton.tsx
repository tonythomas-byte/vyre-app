'use client'

import { FcGoogle } from 'react-icons/fc'
import { MdPhone } from 'react-icons/md'
import styles from './SocialButton.module.css'

interface SocialButtonProps {
  icon: 'google' | 'phone'
  text: string
  onClick: () => void
  variant?: 'light' | 'dark'
}

export default function SocialButton({
  icon,
  text,
  onClick,
  variant = 'light',
}: SocialButtonProps) {
  const IconComponent = icon === 'google' ? FcGoogle : MdPhone

  return (
    <button
      onClick={onClick}
      className={`${styles.socialButton} ${variant === 'light' ? styles.light : styles.dark}`}
    >
      <span className={styles.icon}>
        <IconComponent size={20} />
      </span>
      <span className={styles.text}>{text}</span>
    </button>
  )
}
