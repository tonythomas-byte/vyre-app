'use client'

import React from 'react'
import Image from 'next/image'
import styles from './DailyTaskModule.module.css'

interface DailyTask {
  id: number
  category: string
  categoryIcon: string
  taskPrompt: string
  illustration: string
}

interface DailyTaskModuleProps {
  tasks?: DailyTask[]
  currentIndex?: number
}

export default function DailyTaskModule({ 
  tasks,
  currentIndex = 0 
}: DailyTaskModuleProps) {
  // Default mock data following the documentation pattern
  const defaultTasks: DailyTask[] = [
    {
      id: 1,
      category: 'Gratitude',
      categoryIcon: '/assets/images/landing/category_icon.png',
      taskPrompt: 'What\'s one thing you\'re genuinely thankful for today, big or small?',
      illustration: '/assets/images/landing/dailytcard.png'
    },
    {
      id: 2,
      category: 'Reflection',
      categoryIcon: '/assets/images/landing/category_icon.png',
      taskPrompt: 'What made you smile today?',
      illustration: '/assets/images/landing/dailytcard.png'
    },
    {
      id: 3,
      category: 'Mindfulness',
      categoryIcon: '/assets/images/landing/category_icon.png',
      taskPrompt: 'Take 5 deep breaths and notice how you feel',
      illustration: '/assets/images/landing/dailytcard.png'
    }
  ]

  const dailyTasks = tasks || defaultTasks
  const activeTask = dailyTasks[currentIndex] || dailyTasks[0]

  return (
    <div className={styles.dailyTaskModule}>
      <div className={styles.card}>
        {/* Category icon at top center */}
        <div className={styles.categoryIconWrapper}>
          <Image
            src={activeTask.categoryIcon}
            alt={activeTask.category}
            width={48}
            height={48}
            className={styles.categoryIcon}
          />
        </div>

        {/* Card content wrapper - above background layers */}
        <div className={styles.cardContent}>
          {/* Blob at top-left corner */}
          <div className={styles.blob} />
          
          {/* Category name */}
          <h3 className={styles.categoryName}>{activeTask.category}</h3>

          <div className={styles.content}>
            {/* Text section on left */}
            <div className={styles.textSection}>
              <p className={styles.taskPrompt}>{activeTask.taskPrompt}</p>
              
              {/* Input line */}
              <div className={styles.inputLine} />
            </div>

            {/* Illustration on right */}
            <div className={styles.illustrationSection}>
              <Image
                src={activeTask.illustration}
                alt={`${activeTask.category} illustration`}
                width={200}
                height={200}
                className={styles.illustration}
              />
            </div>
          </div>

          {/* Arrow button */}
          <button className={styles.arrowButton} aria-label="Next">
            →
          </button>
        </div>
      </div>
    </div>
  )
}
