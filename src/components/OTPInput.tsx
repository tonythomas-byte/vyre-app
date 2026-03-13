'use client'

import { useRef, useEffect } from 'react'
import styles from './OTPInput.module.css'

interface OTPInputProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export default function OTPInput({ value, onChange, error }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, newValue: string) => {
    if (newValue && !/^\d$/.test(newValue)) return

    const updatedValue = [...value]
    updatedValue[index] = newValue

    onChange(updatedValue)

    if (newValue && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const updatedValue = [...value]
        updatedValue[index] = ''
        onChange(updatedValue)
      } else if (index > 0) {
        const updatedValue = [...value]
        updatedValue[index - 1] = ''
        onChange(updatedValue)
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4)
    
    if (/^\d+$/.test(pastedData)) {
      const newValue = pastedData.split('').concat(['', '', '', '']).slice(0, 4)
      onChange(newValue)
      
      const nextIndex = Math.min(pastedData.length, 3)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className={styles.otpInputContainer}>
      <div className={styles.inputsWrapper}>
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
          />
        ))}
      </div>
      
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}
