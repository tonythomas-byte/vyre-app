'use client'

import { useState } from 'react'
import styles from './Input.module.css'

interface InputProps {
  label: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={`${styles.input} ${isFocused ? styles.inputFocused : ''} ${error ? styles.inputError : ''}`}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}
