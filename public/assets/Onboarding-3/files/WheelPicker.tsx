'use client'

import React, { useState, useRef, useEffect } from 'react'
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
  const [scrollOffset, setScrollOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const itemHeight = 48 // Height of each number item

  // Generate array of numbers
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  // Calculate which item should be centered based on scroll offset
  const getCenterIndex = () => {
    const index = Math.round(-scrollOffset / itemHeight)
    return Math.max(0, Math.min(index, numbers.length - 1))
  }

  // Snap to nearest item
  const snapToNearest = () => {
    const centerIndex = getCenterIndex()
    const targetOffset = -centerIndex * itemHeight
    setScrollOffset(targetOffset)
    onChange(numbers[centerIndex])
  }

  // Drag handlers
  const handleDragStart = (clientY: number) => {
    setIsDragging(true)
    startYRef.current = clientY
    currentYRef.current = scrollOffset
  }

  const handleDragMove = (clientY: number) => {
    if (!isDragging) return
    const delta = clientY - startYRef.current
    const newOffset = currentYRef.current + delta
    
    // Constrain to bounds
    const minOffset = -(numbers.length - 1) * itemHeight
    const maxOffset = 0
    setScrollOffset(Math.max(minOffset, Math.min(maxOffset, newOffset)))
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    snapToNearest()
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExpanded) return
    e.preventDefault()
    handleDragStart(e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientY)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isExpanded) return
    handleDragStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Global mouse up
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleDragEnd()
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [isDragging])

  // Initialize scroll position when expanded
  useEffect(() => {
    if (isExpanded) {
      const initialIndex = numbers.indexOf(value)
      setScrollOffset(-initialIndex * itemHeight)
    }
  }, [isExpanded])

  // Click outside to collapse
  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onCollapse()
        snapToNearest()
      }
    }

    // Delay to prevent immediate close
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isExpanded])

  // Get item style based on distance from center
  const getItemStyle = (index: number) => {
    const centerIndex = getCenterIndex()
    const distance = Math.abs(index - centerIndex)
    
    let position: 'center' | 'near' | 'far'
    if (distance === 0) position = 'center'
    else if (distance === 1) position = 'near'
    else position = 'far'

    return position
  }

  return (
    <div className={styles.wrapper}>
      {/* Collapsed: Text Input */}
      {!isExpanded && (
        <input
          type="text"
          value={value || ''}
          readOnly
          placeholder="Enter your age"
          onClick={onExpand}
          className={styles.inputCollapsed}
        />
      )}

      {/* Expanded: Wheel Picker */}
      {isExpanded && (
        <div
          ref={containerRef}
          className={styles.wheelExpanded}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Selection indicator lines */}
          <div className={styles.selectionIndicator} />

          {/* Scrollable numbers */}
          <div
            className={styles.wheelTrack}
            style={{
              transform: `translateY(calc(50% - ${itemHeight / 2}px + ${scrollOffset}px))`,
              transition: isDragging ? 'none' : 'transform 200ms ease-out',
            }}
          >
            {numbers.map((num, index) => (
              <div
                key={num}
                className={styles.wheelItem}
                data-position={getItemStyle(index)}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
