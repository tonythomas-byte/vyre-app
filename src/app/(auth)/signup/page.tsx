'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import VyreHeader from '@/components/VyreHeader'
import Input from '@/components/Input'
import Button from '@/components/Button'
import SocialButton from '@/components/SocialButton'
import Divider from '@/components/Divider'
import styles from './signup.module.css'

export default function SignupPage() {
  const router = useRouter()
  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  })

  const validateForm = () => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
    }

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required'
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    setErrors(newErrors)
    return !newErrors.username && !newErrors.email && !newErrors.password
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Sign up successful:', { username, email, password })
      // Navigate to onboarding
      router.push('/onboarding')
    }
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
          {/* Signup Form */}
          <form onSubmit={handleSignUp} className={styles.form}>
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={setUsername}
              error={errors.username}
              required
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              required
            />

            <div className={styles.submitButton}>
              <Button type="submit" variant="blue" fullWidth={false}>
                Sign Up
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
