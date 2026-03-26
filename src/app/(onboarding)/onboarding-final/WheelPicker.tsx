'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from './WheelPicker.module.css'

interface WheelPickerProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  isExpanded: boolean
  onExpand: () => void
  onCollapse: () => void
}

export default function WheelPicker({
  value,
  onChange,
  min = 1,
  max = 100,
  isExpanded,
  onExpand,
  onCollapse,
}: WheelPickerProps) {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  // itemHeight is derived from container — 3 visible slots, center slot = selected
  const [itemHeight, setItemHeight] = useState(88)
  const [containerHeight, setContainerHeight] = useState(0)
  const [wheelHeight, setWheelHeight] = useState<number | null>(null)
  const [scrollOffset, setScrollOffset] = useState(() => {
    const idx = numbers.indexOf(value)
    return (idx !== -1 ? idx : 0) * 88
  })

  const [isDragging, setIsDragging] = useState(false)

  // iOS momentum
  const velocityRef = useRef(0)
  const lastYRef = useRef(0)
  const lastTimeRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const startYRef = useRef(0)
  const startOffsetRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Measure container, derive itemHeight ───────────────────────
  useEffect(() => {
    if (!containerRef.current || !isExpanded) return

    const ro = new ResizeObserver(entries => {
      const h = entries[0].contentRect.height
      if (h <= 0) return
      setContainerHeight(h)

      // 3 visible slots fills the container
      const newItemHeight = Math.floor(h / 3)
      setItemHeight(newItemHeight)

      // Re-sync scroll offset to current value with new item height
      setScrollOffset(prev => {
        const idx = Math.round(prev / (prev > 0 ? prev / Math.round(prev / newItemHeight) : newItemHeight))
        const currentIdx = numbers.indexOf(value)
        return (currentIdx !== -1 ? currentIdx : 0) * newItemHeight
      })
    })

    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [isExpanded]) // eslint-disable-line

  // Calculate dynamic height to reach divider when expanded
  useEffect(() => {
    if (!isExpanded) {
      setWheelHeight(null)
      return
    }

    // Find divider position relative to viewport
    const divider = document.querySelector('[data-divider="true"]')
    const wrapper = containerRef.current?.parentElement

    if (divider && wrapper) {
      const dividerRect = divider.getBoundingClientRect()
      const wrapperRect = wrapper.getBoundingClientRect()
      
      // Calculate height from wrapper top to divider top
      const calculatedHeight = dividerRect.top - wrapperRect.top - 16 // 16px gap
      setWheelHeight(Math.max(200, Math.min(calculatedHeight, window.innerHeight * 0.7)))
    }
  }, [isExpanded])

  // Sync when value changes externally
  useEffect(() => {
    const idx = numbers.indexOf(value)
    if (idx !== -1) setScrollOffset(idx * itemHeight)
  }, [value, itemHeight]) // eslint-disable-line

  // ── Helpers ────────────────────────────────────────────────────

  const clampOffset = useCallback((offset: number) =>
    Math.max(0, Math.min((numbers.length - 1) * itemHeight, offset)),
    [numbers.length, itemHeight]
  )

  const getCenterIndex = useCallback((offset: number) => {
    const idx = Math.round(offset / itemHeight)
    return Math.max(0, Math.min(idx, numbers.length - 1))
  }, [itemHeight, numbers.length])

  const snapToNearest = useCallback((offset: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const idx = getCenterIndex(offset)
    const snapped = idx * itemHeight
    setScrollOffset(snapped)
    onChange(numbers[idx])
  }, [getCenterIndex, itemHeight, numbers, onChange])

  // ── iOS momentum scroll ────────────────────────────────────────

  const startMomentum = useCallback((initialVelocity: number) => {
    const FRICTION = 0.94
    const MIN_VELOCITY = 0.5

    let velocity = initialVelocity
    let currentOffset = 0

    // Capture latest offset via ref to avoid stale closure
    setScrollOffset(prev => { currentOffset = prev; return prev })

    const tick = () => {
      velocity *= FRICTION
      currentOffset = clampOffset(currentOffset - velocity)
      setScrollOffset(currentOffset)

      if (Math.abs(velocity) > MIN_VELOCITY) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        snapToNearest(currentOffset)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [clampOffset, snapToNearest])

  // ── Drag handlers ──────────────────────────────────────────────

  const handleDragStart = (clientY: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setIsDragging(true)
    startYRef.current = clientY
    lastYRef.current = clientY
    lastTimeRef.current = performance.now()
    startOffsetRef.current = scrollOffset
    velocityRef.current = 0
  }

  const handleDragMove = useCallback((clientY: number) => {
    const now = performance.now()
    const dt = now - lastTimeRef.current
    const dy = lastYRef.current - clientY

    // Track velocity (px/ms → px/frame at ~16ms)
    if (dt > 0) velocityRef.current = (dy / dt) * 16

    lastYRef.current = clientY
    lastTimeRef.current = now

    const delta = startYRef.current - clientY
    setScrollOffset(clampOffset(startOffsetRef.current + delta))
  }, [clampOffset])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    const v = velocityRef.current

    if (Math.abs(v) > 1) {
      // Read current offset then launch momentum
      setScrollOffset(current => {
        startMomentum(v)
        return current
      })
    } else {
      setScrollOffset(current => {
        snapToNearest(current)
        return current
      })
    }
  }, [startMomentum, snapToNearest])

  // Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExpanded) return
    e.preventDefault()
    handleDragStart(e.clientY)
  }

  // Touch
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isExpanded) return
    handleDragStart(e.touches[0].clientY)
  }

  // Global listeners while dragging
  useEffect(() => {
    if (!isDragging) return

    const onMouseMove = (e: MouseEvent) => { e.preventDefault(); handleDragMove(e.clientY) }
    const onMouseUp = () => handleDragEnd()
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); handleDragMove(e.touches[0].clientY) }
    const onTouchEnd = () => handleDragEnd()

    window.addEventListener('mousemove', onMouseMove, { passive: false })
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // Click outside → collapse
  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setScrollOffset(current => { snapToNearest(current); return current })
        setTimeout(onCollapse, 50)
      }
    }

    const tid = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 150)
    return () => {
      clearTimeout(tid)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, snapToNearest, onCollapse])

  // Cleanup RAF on unmount
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  // ── Render helpers ─────────────────────────────────────────────

  const getPosition = (index: number): 'center' | 'near' | 'far' => {
    const centerIndex = getCenterIndex(scrollOffset)
    const dist = Math.abs(index - centerIndex)
    if (dist === 0) return 'center'
    if (dist === 1) return 'near'
    return 'far'   // everything beyond ±1 is 'far' — still in DOM
  }

  // Padding pushes the track so item[0] can sit at center
  const paddingY = itemHeight // one item height on each side centers item[0]

  // Indicator lines sit exactly at the edges of the center slot
  const indicatorOffset = itemHeight / 2

  return (
    <div className={styles.wrapper}>
      {/* Collapsed */}
      {!isExpanded && (
        <input
          type="text"
          value={value}
          readOnly
          placeholder="Enter your age"
          onClick={onExpand}
          className={styles.inputCollapsed}
          aria-label="Age input, click to expand wheel picker"
        />
      )}

      {/* Expanded */}
      {isExpanded && (
        <div
          ref={containerRef}
          className={styles.wheelExpanded}
          style={wheelHeight ? { height: `${wheelHeight}px` } : undefined}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label="Age wheel picker"
        >
          <div className={styles.wheelMask}>

            {/* Selection indicator — positioned via inline style so it always
                matches the dynamic itemHeight, not a hardcoded CSS clamp */}
            <div
              className={styles.selectionIndicator}
              style={{
                top: `calc(50% - ${indicatorOffset}px)`,
                height: `${itemHeight}px`,
              }}
            />

            {/* Scrollable track */}
            <div
              className={styles.wheelTrack}
              style={{
                transform: `translateY(${paddingY - scrollOffset}px)`,
                transition: isDragging ? 'none' : 'transform 150ms ease-out',
              }}
            >
              {numbers.map((num, index) => {
                const pos = getPosition(index)
                return (
                  <div
                    key={num}
                    className={styles.wheelItem}
                    data-position={pos}
                    style={{ height: itemHeight }}
                  >
                    {num}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
