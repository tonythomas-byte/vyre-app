'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import VyreHeader from '@/components/VyreHeader'
import OTPInput from '@/components/OTPInput'
import Button from '@/components/Button'
import Checkbox from '@/components/Checkbox'
import styles from './verify-otp.module.css'

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phoneNumber = searchParams.get('phone')
  
  const [otp, setOtp] = useState(['', '', '', ''])
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const validateOTP = () => {
    // Check if all 4 digits are entered
    if (otp.some(digit => digit === '')) {
      setError('Please enter all 4 digits')
      return false
    }

    setError('')
    return true
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateOTP()) {
      const otpCode = otp.join('')
      console.log('OTP verified:', otpCode, 'for phone:', phoneNumber)
      // Navigate to onboarding
      router.push('/onboarding')
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
          <h1 className={styles.heading}>Enter the OTP</h1>

          {/* OTP input form */}
          <form onSubmit={handleContinue} className={styles.form}>
          <OTPInput
            value={otp}
            onChange={setOtp}
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

          {/* Continue Button */}
          <div className={styles.submitButton}>
            <Button type="submit" variant="primary" fullWidth={false}>
              Continue
            </Button>
          </div>
          </form>
        </div>
      </main>
    </PageBackground>
  )
}
