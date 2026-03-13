'use client'

import { useRouter } from 'next/navigation'
import PageBackground from '@/components/PageBackground'
import VyreHeader from '@/components/VyreHeader'
import Button from '@/components/Button'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()

  const handleSignIn = () => {
    router.push('/sign-in')
  }

  const handleSignUp = () => {
    router.push('/onboarding-1')
  }

  return (
    <PageBackground>
      <main className={styles.content} role="main">
        {/* VYRE Logo */}
        <div className={styles.logoContainer}>
          <VyreHeader />
        </div>

        {/* Action buttons */}
        <div className={styles.buttonContainer}>
          <Button 
            variant="primary" 
            onClick={handleSignIn}
            aria-label="Sign in to your account"
          >
            Sign In
          </Button>

          <Button 
            variant="secondary" 
            onClick={handleSignUp}
            aria-label="Create a new account"
          >
            Sign Up
          </Button>
        </div>
      </main>
    </PageBackground>
  )
}
