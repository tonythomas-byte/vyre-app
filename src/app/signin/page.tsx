'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import VyreHeader from '@/components/VyreHeader'
import Input from '@/components/Input'
import Button from '@/components/Button'
import SocialButton from '@/components/SocialButton'
import Divider from '@/components/Divider'
import Checkbox from '@/components/Checkbox'
import styles from './signin.module.css'

export default function SignInPage() {
  const router = useRouter()
  
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  
  const [errors, setErrors] = useState({
    usernameOrEmail: '',
    password: '',
  })

  const validateForm = () => {
    const newErrors = {
      usernameOrEmail: '',
      password: '',
    }

    // Username or email validation
    if (!usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or email is required'
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return !newErrors.usernameOrEmail && !newErrors.password
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Sign in successful:', { usernameOrEmail, password, rememberMe })
      // Navigate to onboarding
      router.push('/onboarding')
    }
  }

  const handleForgotPassword = () => {
    console.log('Forgot password clicked')
    // TODO: Navigate to password reset page
  }

  const handleGoogleSignIn = () => {
    console.log('Continue with Google clicked')
    // TODO: Implement Google OAuth
  }

  const handlePhoneSignIn = () => {
    console.log('Continue with Phone clicked')
    // Navigate to phone login page
    router.push('/phone-login')
  }

  return (
    <PageBackground>
      <main className={styles.content}>
        {/* VYRE Logo */}
        <div className={styles.logoContainer}>
          <VyreHeader width={140} height={55} />
        </div>

        <div className={styles.formContainer}>
          {/* Signin Form */}
          <form onSubmit={handleSignIn} className={styles.form}>
            <Input
              label="Username or email"
              type="text"
              value={usernameOrEmail}
              onChange={setUsernameOrEmail}
              error={errors.usernameOrEmail}
              required
            />

            <Input
              label="Enter the Password"
              type="password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              required
            />

            {/* Remember me and Forgot password */}
            <div className={styles.rememberForgot}>
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={setRememberMe}
              />
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className={styles.forgotPassword}
              >
                Forgot password
              </button>
            </div>

            <div className={styles.submitButton}>
              <Button type="submit" variant="blue" fullWidth={false}>
                Sign In
              </Button>
            </div>
          </form>

          {/* Social login buttons */}
          <div className={styles.googleButton}>
            <SocialButton
              icon="google"
              text="Continue with Google"
              onClick={handleGoogleSignIn}
              variant="light"
            />
          </div>

          {/* Divider */}
          <Divider text="Or" />

          {/* Phone button */}
          <div className={styles.phoneButton}>
            <SocialButton
              icon="phone"
              text="Continue with Phone No"
              onClick={handlePhoneSignIn}
              variant="dark"
            />
          </div>
        </div>
      </main>
    </PageBackground>
  )
}
