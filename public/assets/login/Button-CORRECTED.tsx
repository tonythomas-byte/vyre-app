'use client'

import styles from './Button.module.css'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  ariaLabel?: string
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={`${styles.button} ${
        variant === 'primary' ? styles.primary : styles.secondary
      } ${!fullWidth ? styles.buttonAuto : ''}`}
    >
      {loading ? (
        <span className={styles.loadingText}>Loading...</span>
      ) : (
        children
      )}
    </button>
  )
}
