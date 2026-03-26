'use client'

import React from 'react'
import Image from 'next/image'
import styles from './FooterNav.module.css'

interface FooterNavProps {
  onNavigate?: (destination: 'groups' | 'menu' | 'profile' | 'explore' | 'account') => void
}

export default function FooterNav({ onNavigate }: FooterNavProps) {
  const handleNavigation = (destination: 'groups' | 'menu' | 'profile' | 'explore' | 'account') => {
    if (onNavigate) {
      onNavigate(destination)
    }
  }

  return (
    <nav className={styles.footerNav} role="navigation" aria-label="Bottom navigation">
      {/* Left side - F1 and F2 */}
      <button 
        className={styles.navButton}
        onClick={() => handleNavigation('groups')}
        aria-label="Groups"
        type="button"
      >
        <Image
          src="/assets/icons/footer-nav/footer_1.svg"
          alt=""
          width={24}
          height={24}
          className={styles.icon}
        />
      </button>

      <button 
        className={styles.navButton}
        onClick={() => handleNavigation('menu')}
        aria-label="Menu"
        type="button"
      >
        <Image
          src="/assets/icons/footer-nav/footer_2.svg"
          alt=""
          width={24}
          height={24}
          className={styles.icon}
        />
      </button>

      {/* Center - middle.svg (elevated avatar) */}
      <button 
        className={`${styles.navButton} ${styles.avatarButton}`}
        onClick={() => handleNavigation('profile')}
        aria-label="Profile"
        type="button"
      >
        <div className={styles.avatar}>
          <Image
            src="/assets/icons/footer-nav/footer_3_avatar.svg"
            alt="User avatar"
            width={48}
            height={48}
            className={styles.avatarImage}
          />
        </div>
      </button>

      {/* Right side - f3 and f4 */}
      <button 
        className={styles.navButton}
        onClick={() => handleNavigation('explore')}
        aria-label="Explore"
        type="button"
      >
        <Image
          src="/assets/icons/footer-nav/footer_4.svg"
          alt=""
          width={24}
          height={24}
          className={styles.icon}
        />
      </button>

      <button 
        className={styles.navButton}
        onClick={() => handleNavigation('account')}
        aria-label="Account"
        type="button"
      >
        <Image
          src="/assets/icons/footer-nav/footer_5.svg"
          alt=""
          width={24}
          height={24}
          className={styles.icon}
        />
      </button>
    </nav>
  )
}