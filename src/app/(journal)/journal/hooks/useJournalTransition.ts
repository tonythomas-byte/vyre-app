import { Variants } from 'framer-motion'

const SNAP_SPRING = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 28,
  mass: 0.9,
}

const DROP_SPRING = {
  type: 'spring' as const,
  stiffness: 220,
  damping: 24,
  mass: 0.8,
}

const BOUNCE_SPRING = {
  type: 'spring' as const,
  stiffness: 180,
  damping: 14,
  mass: 0.7,
}

const FADE_SPRING = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 22,
  mass: 0.6,
}

export const avatarVariants: Variants = {
  initial: { scale: 1.8, opacity: 1 },
  settled: {
    scale: 1,
    opacity: 1,
    transition: { scale: { ...SNAP_SPRING } },
  },
}

export const floralVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4, y: 80 },
  visible: {
    opacity: 1,
    scale: 1,
    y: -40,
    transition: {
      opacity: { duration: 0.25, delay: 0.3 },
      scale:   { ...DROP_SPRING, delay: 0.3 },
      y:       { ...DROP_SPRING, delay: 0.3 },
    },
  },
  bounce: {
    opacity: 1,
    scale: 1,
    y: [-48, -40],
    transition: { y: { ...BOUNCE_SPRING, delay: 0.4 } },
  },
}

export const shadowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4, y: 80 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.25, delay: 0.35 },
      scale:   { ...DROP_SPRING, delay: 0.35 },
      y:       { ...DROP_SPRING, delay: 0.35 },
    },
  },
  bounce: {
    opacity: 1,
    scale: 1,
    y: [-6, 0],
    transition: { y: { ...BOUNCE_SPRING, delay: 0.42 } },
  },
}

export const micVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      opacity: { ...FADE_SPRING, delay: 0.45 },
      scale:   { ...FADE_SPRING, delay: 0.45 },
      y:       { ...FADE_SPRING, delay: 0.45 },
    },
  },
  bounce: {
    opacity: 1,
    scale: 1,
    y: [-8, 0],
    transition: { y: { ...BOUNCE_SPRING, delay: 0.52 } },
  },
}

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.3, delay: 0.2 },
      y:       { ...SNAP_SPRING, delay: 0.2 },
    },
  },
}
