'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useAnimate } from 'framer-motion'
import Image from 'next/image'
import CalendarIcon from '@/components/CalendarIcon'
import styles from './SavePillScene.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────
type Act = 1 | 2 | 3 | 4 | 5

const ACT_DURATIONS: Record<Act, number> = {
  1: 2500,
  2: 1500,
  3: 2500,
  4: 4600,
  5: 99999, // Act 5 self-manages its sequence, never times out
}

// ─── Shared layout constants ──────────────────────────────────────────────────
const CARD_FULL  = 340
const CARD_W_CSS = 'min(82vw, 340px)'
const HALF       = 160

// Act 1 — pill halves start far out
const HALF_LEFT_START  = `calc(50% - ${CARD_FULL / 2}px - 60px)`
const HALF_RIGHT_START = `calc(50% - ${CARD_FULL / 2}px - 60px)`

// Act 2 end — halves closed in + tilted
const HALF_LEFT_END  = `calc(50% - 180px)`
const HALF_RIGHT_END = `calc(50% - 180px)`

// Act 3 end — halves meet at center, no tilt (full pill)
// full pill width = HALF * 2 = 320px → each half left/right = 50% - 160px
const HALF_LEFT_CLOSE  = `calc(50% - ${HALF}px)`
const HALF_RIGHT_CLOSE = `calc(50% - ${HALF}px)`

const SPRING      = { type: 'spring' as const, stiffness: 100, damping: 15 }
const SPRING_SLOW = { type: 'spring' as const, stiffness: 80, damping: 16 }

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function SavePillScene() {
  const nav = useRouter()

  const [mood,   setMood]   = useState('Ecstatic')
  const [day,    setDay]    = useState('Sunday')
  const [date,   setDate]   = useState('February 8, 2026')
  const [avatar, setAvatar] = useState('/assets/images/landing/Zen_character.png')
  const [act,    setAct]    = useState<Act>(1)

  useEffect(() => {
    const raw = sessionStorage.getItem('savePillData')
    if (raw) {
      try {
        const data = JSON.parse(raw)
        if (data.mood)   setMood(data.mood)
        if (data.day)    setDay(data.day)
        if (data.date)   setDate(data.date)
        if (data.avatar) setAvatar(data.avatar)
      } catch (_) { /* keep defaults */ }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (act === 1) setAct(2)
      if (act === 2) setAct(3)
      if (act === 3) setAct(4)
      if (act === 4) setAct(5)
      // act 5 self-manages via useAnimate
    }, ACT_DURATIONS[act])
    return () => clearTimeout(timer)
  }, [act, nav])

  return (
    <div className={styles.page}>
      {act === 1 && <Act1 mood={mood} day={day} date={date} />}
      {act === 2 && <Act2 mood={mood} day={day} date={date} avatar={avatar} />}
      {act === 3 && <Act3 mood={mood} day={day} date={date} avatar={avatar} />}
      {act === 4 && <Act4 avatar={avatar} />}
      {act === 5 && <Act5 avatar={avatar} />}
    </div>
  )
}

// ─── Act 1 ────────────────────────────────────────────────────────────────────
function Act1({ mood, day, date }: { mood: string; day: string; date: string }) {
  return (
    <div className={styles.act1}>
      <PillLeft leftCss={HALF_LEFT_START} rotate={0} size={HALF} showZen={false} />
      <PillRight rightCss={HALF_RIGHT_START} rotate={0} size={HALF} />
      <RevealCardFull mood={mood} day={day} date={date} />
    </div>
  )
}

// ─── Act 2 ────────────────────────────────────────────────────────────────────
function Act2({ mood, day, date, avatar }: { mood: string; day: string; date: string; avatar: string }) {
  return (
    <div className={styles.act2}>

      {/* Left pill half — moves inward + tilts -15° */}
      <motion.div
        className={styles.pillLeft}
        style={{ width: HALF, height: HALF, top: '50%', borderRadius: '80px 0 0 80px' }}
        initial={{ left: HALF_LEFT_START, translateY: '-50%', rotate: 0 }}
        animate={{ left: HALF_LEFT_END,   translateY: '-50%', rotate: -15 }}
        transition={SPRING}
        aria-hidden="true"
      >
        <div className={styles.floralWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icons/journal/floral%20under%20avatar.svg" alt="" className={styles.floralImg} />
          <motion.img
            src={avatar}
            alt="zen"
            className={styles.zenInPill}
            style={{ position: 'absolute', top: '50%', left: '50%', x: '-50%', y: '-50%' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0, duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Right pill half — moves inward + tilts +15° */}
      <motion.div
        className={styles.pillRight}
        style={{ width: HALF, height: HALF, top: '50%', borderRadius: '0 80px 80px 0' }}
        initial={{ right: HALF_RIGHT_START, translateY: '-50%', rotate: 0 }}
        animate={{ right: HALF_RIGHT_END,   translateY: '-50%', rotate: 15 }}
        transition={SPRING}
        aria-hidden="true"
      />

      {/* Shrinking card */}
      <motion.div
        className={styles.revealCardAct2}
        style={{ position: 'absolute', left: '50%', top: '50%' }}
        initial={{ width: CARD_FULL, height: CARD_FULL, translateX: '-50%', translateY: '-50%', opacity: 1 }}
        animate={{ width: 100, height: 150, translateX: '-50%', translateY: '-65%', opacity: 1 }}
        transition={SPRING}
        aria-hidden="true"
      >
        <Image src="/assets/illustrations/landing/player.svg" alt="" width={80} height={100} className={styles.playerImgSmall} />
        <div className={styles.placeholderBlock} />
        <div className={`${styles.placeholderBlock} ${styles.placeholderBlockShort}`} />
      </motion.div>

    </div>
  )
}

// ─── Act 3 ────────────────────────────────────────────────────────────────────
function Act3({ mood, day, date, avatar }: { mood: string; day: string; date: string; avatar: string }) {
  return (
    <div className={styles.act3}>

      {/* ── Left pill half — un-tilts + closes to center ── */}
      <motion.div
        className={styles.pillLeft}
        style={{ width: HALF, height: HALF, top: '50%', borderRadius: '80px 0 0 80px' }}
        initial={{ left: HALF_LEFT_END,   translateY: '-50%', rotate: -15 }}
        animate={{ left: HALF_LEFT_CLOSE, translateY: '-50%', rotate: 0 }}
        transition={SPRING_SLOW}
        aria-hidden="true"
      >
        <div className={styles.floralWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icons/journal/floral%20under%20avatar.svg" alt="" className={styles.floralImg} />
          {/* Zen stays visible — no animation needed, already shown */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt="zen"
            className={styles.zenInPill}
            style={{ position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </motion.div>

      {/* ── Right pill half — un-tilts + closes to center ── */}
      <motion.div
        className={styles.pillRight}
        style={{ width: HALF, height: HALF, top: '50%', borderRadius: '0 80px 80px 0',
          overflow: 'hidden', position: 'absolute' }}
        initial={{ right: HALF_RIGHT_END,   translateY: '-50%', rotate: 15 }}
        animate={{ right: HALF_RIGHT_CLOSE, translateY: '-50%', rotate: 0 }}
        transition={SPRING_SLOW}
        aria-hidden="false"
      >
        {/* ── Mood text — slides in AFTER halves close (~0.3s) ── */}
        <motion.p
          className={styles.act3Mood}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
        >
          {mood}
        </motion.p>
      </motion.div>

      {/* ── Calendar + date — animates from page background into right pill ── */}
      {/* Starts below viewport centre, slides up and lands below mood text    */}
      {/* Final position: right pill left edge = 50%, mood text top ~12px      */}
      {/* Calendar settled: left=50%+10px, top=50%-HALF/2+52px                */}
      <motion.div
        className={styles.act3DateRow}
        initial={{ opacity: 0, y: 400 }}
        animate={{
          opacity: [0, 0, 1, 1],
          y:       [400, 200, 100, 0],
        }}
        transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut', times: [0, 0.3, 0.6, 1] }}
        style={{
          position: 'absolute',
          left: 'calc(50% + 20px)',
          top:  'calc(50% - 80px + 72px)',
        }}
      >
        <div className={styles.act3CalBlock}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/icons/landing/calender.svg"
            alt=""
            className={styles.act3CalIcon}
          />
          <span className={styles.act3DateText}>{day}, {date}</span>
        </div>
      </motion.div>

      {/* ── Falling card — starts AFTER mood slides in (~0.8s) ── */}
      <motion.div
        className={styles.fallingCard}
        initial={{ x: '-50%' }}
        animate={{
          y:       [0, 200, 250],
          opacity: [0.7, 0.7, 0],
          x:       '-50%',
        }}
        transition={{ delay: 0.8, duration: 0.6, ease: 'easeIn', times: [0, 0.8, 1] }}
        aria-hidden="true"
      >
        <Image src="/assets/illustrations/landing/player.svg" alt="" width={60} height={80} className={styles.playerImgSmall} />
        <div className={styles.placeholderBlock} />
      </motion.div>

    </div>
  )
}

// ─── Act 4 ────────────────────────────────────────────────────────────────────
// Purple half: simultaneous -180° rotation + linear slide left→right (useAnimate)
// Cream half: fades out at right, fades back in at left
// Then both tilt ±15°, avatar rises from seam

const ACT4_LEFT_OPEN  = `calc(50% - 180px)`

function Act4({ avatar }: { avatar: string }) {
  const [purpleRef, animatePurple] = useAnimate()
  const [avatarRef, animateAvatar] = useAnimate()
  const [showCreamLeft, setShowCreamLeft] = useState(false)
  const [pillOpen,      setPillOpen]      = useState(false)
  const [showAvatar,    setShowAvatar]    = useState(false)

  useEffect(() => {
    async function run() {
      await animatePurple(purpleRef.current, {
        x:      HALF,
        rotate: -180,
      }, { duration: 2.5, ease: [0.4, 0, 0.6, 1] })

      setShowCreamLeft(true)
      await new Promise(r => setTimeout(r, 800))

      setPillOpen(true)
      await new Promise(r => setTimeout(r, 600))

      // Avatar rises from crack (entrance)
      setShowAvatar(true)
      await new Promise(r => setTimeout(r, 50)) // let DOM mount

      // Entrance: fade in + rise up
      await animateAvatar(avatarRef.current, {
        opacity: 1,
        transform: 'translateX(-50%) translateY(0px)',
      }, { duration: 0.6, ease: 'easeOut' })
    }
    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.act4}>

      {/* ── Translucent placeholder left behind when purple half slides right ── */}
      <motion.div
        style={{
          position: 'absolute',
          width: HALF,
          height: HALF,
          top: '50%',
          left: HALF_LEFT_CLOSE,
          transform: 'translateY(-50%)',
          borderRadius: '80px 0 0 80px',
          background: 'rgba(0, 0, 0, 0.05)',
          border: '1.5px dashed rgba(0, 0, 0, 0.12)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
        animate={{ opacity: showCreamLeft ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        aria-hidden="true"
      />

      {/* ── Cream — invisible at right initially, appears at left after swap ── */}
      {showCreamLeft && (
        <motion.div
          className={styles.pillRight}
          style={{
            width: HALF, height: HALF, top: '50%',
            left: HALF_LEFT_CLOSE,
            translateY: '-50%',
            borderRadius: '80px 0 0 80px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: pillOpen ? -15 : 0 }}
          transition={{ duration: 0.4 }}
          aria-hidden="true"
        />
      )}

      {/* ── Purple — starts left, simultaneously rotates -180° + slides right ── */}
      <motion.div
        ref={purpleRef}
        className={styles.pillLeft}
        style={{
          width: HALF, height: HALF, top: '50%',
          left: HALF_LEFT_CLOSE,
          translateY: '-50%',
          borderRadius: '80px 0 0 80px',
          x: 0, rotate: 0,
        }}
        animate={pillOpen ? { rotate: -180 + 15 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        aria-hidden="true"
      >
        <div className={styles.floralWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icons/journal/floral%20under%20avatar.svg" alt="" className={styles.floralImg} />
        </div>
      </motion.div>

      {/* ── Avatar — controlled entirely by useAnimate ── */}
      {showAvatar && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={avatarRef}
          src={avatar}
          alt="avatar"
          className={styles.act4Avatar}
          style={{ opacity: 0, transform: 'translateX(-50%) translateY(40px)' }}
        />
      )}

    </div>
  )
}

// ─── Act 5 ────────────────────────────────────────────────────────────────────
// 1. Background changes instantly (split: centre warm gradient, sides blue)
// 2. Pill halves fade out instantly
// 3. Avatar slides to viewport centre + scales 1→1.2 (ease, 0.7s)
// 4. VYRE heading fades in (0.4s delay)
// 5. Hold 1.5s
// 6. Heading + side backgrounds fade out (0.3s)
// 7. Avatar scales up toward 180px + slides to landing arch position (top-centre)
// 8. Navigate to /landing — landing reads sessionStorage to skip avatar entrance

// Landing avatar sits inside the arch hero section, roughly top-25% of viewport
// We estimate its screen position as top: ~20vh, left: 50%
const LANDING_AVATAR_SIZE = 180

function Act5({ avatar }: { avatar: string }) {
  const nav = useRouter()
  const [avatarScope,    animateAvatar] = useAnimate()
  const [showHeading,    setShowHeading]    = useState(false)
  const [headingVisible, setHeadingVisible] = useState(false)
  const [bgVisible,      setBgVisible]      = useState(true)

  useEffect(() => {
    async function run() {
      // Step 1: avatar slides to viewport centre + scales 1 → 1.2
      if (avatarScope.current) {
        await animateAvatar(avatarScope.current, {
          x: '-50%',
          y: '-50%',
          scale: 1.2,
        }, { duration: 0.7, ease: 'easeOut' })
      }

      // Step 2: VYRE heading fades in
      setShowHeading(true)
      await new Promise(r => setTimeout(r, 50))
      setHeadingVisible(true)

      // Step 3: hold
      await new Promise(r => setTimeout(r, 1500))

      // Step 4: heading + background fade out
      setHeadingVisible(false)
      setBgVisible(false)
      await new Promise(r => setTimeout(r, 350))

      // Step 5: store avatar bounding rect so landing can continue the animation
      if (avatarScope.current) {
        const rect = (avatarScope.current as HTMLElement).getBoundingClientRect()
        sessionStorage.setItem('avatarRect', JSON.stringify({
          top:    rect.top,
          left:   rect.left,
          width:  rect.width,
          height: rect.height,
        }))
      }

      // Step 6: navigate
      sessionStorage.setItem('avatarTransitionDone', '1')
      nav.push('/landing')
    }
    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.act5}>
      {/* Side panels */}
      <motion.div
        className={`${styles.act5Side} ${styles.act5SideLeft}`}
        animate={{ opacity: bgVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className={`${styles.act5Side} ${styles.act5SideRight}`}
        animate={{ opacity: bgVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Centre warm gradient column */}
      <motion.div
        className={styles.act5Centre}
        animate={{ opacity: bgVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* VYRE heading */}
      {showHeading && (
        <motion.div
          className={styles.act5Heading}
          initial={{ opacity: 0 }}
          animate={{ opacity: headingVisible ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/journal/v.svg"
            alt="VYRE"
            className={styles.act5HeadingImg}
          />
        </motion.div>
      )}

      {/* Avatar — controlled by useAnimate */}
      <motion.img
        ref={avatarScope}
        src={avatar}
        alt="avatar"
        className={styles.act5Avatar}
        initial={{ x: '-50%', y: -180, scale: 1 }}
      />
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function PillLeft({ leftCss, rotate, size, showZen }: {
  leftCss: string; rotate: number; size: number; showZen: boolean
}) {
  return (
    <div
      className={styles.pillLeft}
      style={{
        width: size, height: size, top: '50%', left: leftCss,
        transform: `translateY(-50%) rotate(${rotate}deg)`,
        borderRadius: '80px 0 0 80px',
      }}
      aria-hidden="true"
    >
      <div className={styles.floralWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/icons/journal/floral%20under%20avatar.svg" alt="" className={styles.floralImg} />
      </div>
    </div>
  )
}

function PillRight({ rightCss, rotate, size }: { rightCss: string; rotate: number; size: number }) {
  return (
    <div
      className={styles.pillRight}
      style={{
        width: size, height: size, top: '50%', right: rightCss,
        transform: `translateY(-50%) rotate(${rotate}deg)`,
        borderRadius: '0 80px 80px 0',
      }}
      aria-hidden="true"
    />
  )
}

function RevealCardFull({ mood, day, date }: { mood: string; day: string; date: string }) {
  return (
    <div
      className={styles.revealCard}
      style={{
        width:    'min(319px, calc(100vw - 18px))',
        height:   '273px',
        position: 'relative',
      }}
    >
      {/* Calendar icon — top-left, date text inside the calendar SVG */}
      <div className={styles.revealCalIcon}>
        <CalendarIcon day={day} date={date} size={90} fontSize={8} />
      </div>

      {/* Mood — top-right, matching PillCard.revealMood */}
      <p className={styles.revealMood}>{mood}</p>

      {/* Player illustration — matching PillCard.revealPlayer */}
      <Image
        src="/assets/illustrations/landing/player.svg"
        alt=""
        width={174}
        height={224}
        className={styles.revealPlayer}
      />

      {/* Song section — matching PillCard */}
      <p className={styles.revealSongLabel}>Song from this moment</p>
      <p className={styles.revealSongName}>Happy - Pharrell Williams</p>
    </div>
  )
}
