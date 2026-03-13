'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import VyreHeader from '@/components/VyreHeader'
import PhoneInput from '@/components/PhoneInput'
import Button from '@/components/Button'
import Checkbox from '@/components/Checkbox'
import styles from './phone-login.module.css'

export default function PhoneLoginPage() {
  const router = useRouter()
  
  const [phoneNumber, setPhoneNumber] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const validatePhoneNumber = () => {
    // Indian phone number validation: 10 digits
    if (!phoneNumber.trim()) {
      setError('Phone number is required')
      return false
    }
    
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number')
      return false
    }

    setError('')
    return true
  }

  const handleGetOTP = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validatePhoneNumber()) {
      console.log('Sending OTP to:', `+91${phoneNumber}`)
      // Navigate to OTP verification page
      router.push(`/verify-otp?phone=${phoneNumber}`)
    }
  }

  return (
    <PageBackground>
      <main className={styles.content}>
        {/* VYRE Logo */}
        <div className={styles.logoContainer}>
          <VyreHeader width={140} height={55} />
        </div>

        <div className={styles.formContainer}>
          {/* Heading */}
          <h1 className={styles.heading}>Login with Phone number</h1>

          {/* Phone input form */}
          <form onSubmit={handleGetOTP} className={styles.form}>
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            error={error}
          />

          {/* Remember me */}
          <div className={styles.rememberMe}>
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={setRememberMe}
            />
          </div>

          {/* Get OTP Button */}
          <div className={styles.submitButton}>
            <Button type="submit" variant="primary" fullWidth={false}>
              Get OTP
            </Button>
          </div>
          </form>
        </div>
      </main>
    </PageBackground>
  )
}
