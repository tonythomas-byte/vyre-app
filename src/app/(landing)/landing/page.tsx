'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAnimate } from 'framer-motion'
import PageBackground from '@/components/PageBackground'
import LandingBackground from './LandingBackground'
import HeroWithArchNavigation from './HeroWithArchNavigation'
import JournalModule from './JournalModule'
import DailyTaskModule from './DailyTaskModule'
import DailyQuoteModule from './DailyQuoteModule'
import FooterNav from '@/components/FooterNav'
import DecorativeFloras from './DecorativeFloras'
import styles from './landing.module.css'

interface AvatarRect {
  top: number
  left: number
  width: number
  height: number
}

export default function LandingPage() {
  const router = useRouter()

  // ── Pill-saved celebration state ──────────────────────────────────────────
  const [pillSaved,      setPillSaved]      = useState(false)
  const [floraRotating,  setFloraRotating]  = useState(false)
  const [floraResetting, setFloraResetting] = useState(false)

  // ── Avatar overlay transition ─────────────────────────────────────────────
  const [avatarOverlay, setAvatarOverlay] = useState<AvatarRect | null>(null)
  const [avatarSrc,     setAvatarSrc]     = useState('/assets/images/landing/Zen_character.png')
  const [overlayScope,  animateOverlay]   = useAnimate()
  const archAvatarRef = useRef<HTMLDivElement>(null)

  const celebrationRan = useRef(false)

  useEffect(() => {
    if (celebrationRan.current) return

    const saved   = sessionStorage.getItem('avatarTransitionDone')
    const rectRaw = sessionStorage.getItem('avatarRect')
    const src     = sessionStorage.getItem('savePillData')
      ? JSON.parse(sessionStorage.getItem('savePillData')!).avatar
      : null

    if (!saved) return
    celebrationRan.current = true
    sessionStorage.removeItem('avatarTransitionDone')
    sessionStorage.removeItem('avatarRect')

    if (src) setAvatarSrc(src)

    // ── Avatar overlay: start at Act5 position, animate to arch ──────────
    if (rectRaw) {
      const rect: AvatarRect = JSON.parse(rectRaw)
      setAvatarOverlay(rect)

      // After one frame (overlay mounted), animate to arch position
      requestAnimationFrame(() => {
        requestAnimationFrame(async () => {
          if (!overlayScope.current || !archAvatarRef.current) return

          const archRect = archAvatarRef.current.getBoundingClientRect()

          await animateOverlay(overlayScope.current, {
            top:    archRect.top,
            left:   archRect.left,
            width:  archRect.width,
            height: archRect.height,
          }, {
            type:      'spring',
            stiffness: 120,
            damping:   20,
          })

          // Animation done — hide overlay, show real arch avatar
          setAvatarOverlay(null)
        })
      })
    }

    // ── Celebration ───────────────────────────────────────────────────────
    setPillSaved(true)
    setTimeout(() => setFloraRotating(true),  400)
    setTimeout(() => { setFloraRotating(false); setFloraResetting(true) }, 400 + 800)
    setTimeout(() => { setFloraResetting(false); setPillSaved(false) }, 400 + 800 + 800)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNavigation = (destination: 'treasure' | 'journal' | 'calendar') => {
    switch (destination) {
      case 'treasure': router.push('/treasure-pill'); break
      case 'journal':  router.push('/journal');       break
      case 'calendar': router.push('/calendar');      break
    }
  }

  const handleFooterNavigation = (destination: 'groups' | 'menu' | 'profile' | 'explore' | 'account') => {
    switch (destination) {
      case 'groups':  router.push('/groups');  break
      case 'menu':    router.push('/menu');    break
      case 'profile': router.push('/profile'); break
      case 'explore': router.push('/explore'); break
      case 'account': router.push('/account'); break
    }
  }

  return (
    <LandingBackground>
      <PageBackground>
        <div className={styles.pageContainer}>
          <DecorativeFloras
            rotating={floraRotating}
            resetting={floraResetting}
          />

          <HeroWithArchNavigation
            userName="there"
            userAvatar={avatarSrc}
            onNavigate={handleNavigation}
            pillSaved={pillSaved}
            rotating={floraRotating}
            resetting={floraResetting}
            archAvatarRef={archAvatarRef}
            // hide the real avatar while overlay is animating
            avatarHidden={!!avatarOverlay}
          />

          {/* ── Avatar overlay — fixed, animates from Act5 pos to arch pos ── */}
          {avatarOverlay && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={overlayScope}
              src={avatarSrc}
              alt=""
              style={{
                position: 'fixed',
                top:      avatarOverlay.top,
                left:     avatarOverlay.left,
                width:    avatarOverlay.width,
                height:   avatarOverlay.height,
                objectFit: 'contain',
                zIndex:   9999,
                pointerEvents: 'none',
              }}
            />
          )}

          <main className={styles.contentSection}>
            <JournalModule />
            <DailyTaskModule />
            <DailyQuoteModule />
          </main>

          <footer className={styles.footerSection}>
            <FooterNav onNavigate={handleFooterNavigation} />
          </footer>
        </div>
      </PageBackground>
    </LandingBackground>
  )
}
