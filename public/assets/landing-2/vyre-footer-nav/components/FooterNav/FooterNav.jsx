import React from 'react';
import styles from './FooterNav.module.css';

export default function FooterNav() {
  return (
    <nav className={styles.footerNav} role="navigation" aria-label="Bottom navigation">
      <button 
        className={styles.navButton}
        aria-label="Groups"
        type="button"
      >
        <svg 
          className={styles.icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button 
        className={styles.navButton}
        aria-label="Menu"
        type="button"
      >
        <svg 
          className={styles.icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>

      <button 
        className={`${styles.navButton} ${styles.avatarButton}`}
        aria-label="Profile"
        type="button"
      >
        <div className={styles.avatar}>
          <img 
            src="/assets/landing-2/avatar.png" 
            alt="User avatar"
            className={styles.avatarImage}
          />
        </div>
      </button>

      <button 
        className={styles.navButton}
        aria-label="Explore"
        type="button"
      >
        <svg 
          className={styles.icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M21.5 12a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0Z" 
            stroke="currentColor" 
            strokeWidth="2"
          />
          <path 
            d="M12 12c2.5-2.5 5-5 7-3s-.5 4.5-3 7-5 5-7 3 .5-4.5 3-7Z" 
            fill="currentColor"
          />
        </svg>
      </button>

      <button 
        className={styles.navButton}
        aria-label="Account"
        type="button"
      >
        <svg 
          className={styles.icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle 
            cx="12" 
            cy="8" 
            r="4" 
            stroke="currentColor" 
            strokeWidth="2"
          />
          <path 
            d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </button>
    </nav>
  );
}
