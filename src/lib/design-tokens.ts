/**
 * Vyre Design System
 * Central design tokens for colors, spacing, typography, and other design values
 */

export const colors = {
  // Primary brand colors
  primary: {
    black: '#000000',
    white: '#FFFFFF',
  },

  // Background gradients
  background: {
    gradient: 'radial-gradient(219.15% 97.49% at 68.18% 98.35%, #FDDAF6 0%, #FEE8ED 30.77%, #FFF9E2 74.45%, #FFDAEE 100%)',
    pink: '#FDDAF6',
    lightPink: '#FEE8ED',
    cream: '#FFF9E2',
    softPink: '#FFDAEE',
  },

  // Decorative orbs/blurs
  orbs: {
    purple1: 'rgba(180, 129, 235, 0.25)',
    purple2: 'rgba(171, 129, 235, 0.25)',
    purple3: 'rgba(162, 128, 236, 0.25)',
    purple4: 'rgba(153, 128, 236, 0.25)',
    purple5: 'rgba(144, 128, 236, 0.25)',
    purple6: 'rgba(134, 127, 236, 0.25)',
    magenta: 'rgba(255, 25, 240, 0.25)',
    blue: 'rgba(9, 0, 255, 0.25)',
    pink: 'rgba(255, 0, 200, 0.25)',
  },

  // UI elements
  ui: {
    border: '#BCBCBC',
    glassBackground: 'rgba(255, 255, 255, 0.2)',
    glassBackgroundHover: 'rgba(255, 255, 255, 0.3)',
    buttonHover: '#1a1a1a',
    textGray: '#999999',
  },
}

export const spacing = {
  // Base spacing scale (in pixels)
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
  '5xl': '100px',
  '6xl': '120px',
}

export const typography = {
  // Font families
  fontFamily: {
    primary: 'Playfair Display, serif',
    secondary: 'Afacad, sans-serif',
  },

  // Font sizes
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '55px',
    '6xl': '80px',
    hero: '28rem', // For landing page animation
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.3px',
    normal: '0',
    wide: '0.5px',
  },
}

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
}

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
}

export const transitions = {
  fast: '150ms ease',
  normal: '300ms ease',
  slow: '500ms ease',
  smooth: 'all 0.3s ease',
}

export const breakpoints = {
  // Mobile first approach
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
}

export const effects = {
  backdropBlur: {
    sm: 'blur(12px)',
    md: 'blur(22.5px)',
    lg: 'blur(50px)',
    xl: 'blur(100px)',
  },
  blur: {
    sm: 'blur(20px)',
    md: 'blur(50px)',
    lg: 'blur(90px)',
    xl: 'blur(120px)',
  },
}
