'use client'

import { useState } from 'react'
import IN from 'country-flag-icons/react/3x2/IN'
import styles from './PhoneInput.module.css'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export default function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const numericValue = e.target.value.replace(/\D/g, '')
    // Limit to 10 digits
    if (numericValue.length <= 10) {
      onChange(numericValue)
    }
  }

  return (
    <div className={styles.phoneInputContainer}>
      <div className={`${styles.inputWrapper} ${isFocused ? styles.inputFocused : ''} ${error ? styles.inputError : ''}`}>
        {/* Country code selector */}
        <div className={styles.countryCode}>
          <IN className={styles.flag} />
          <span className={styles.dropdownIcon}>▼</span>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Phone number input */}
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter phone number"
          className={styles.input}
          maxLength={10}
        />
      </div>
      
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}
