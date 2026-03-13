import React from 'react';
import styles from './DailyTaskCarousel.module.css';

export default function DailyTaskCarousel() {
  // Hardcoded mock data
  const dailyTasks = [
    {
      id: 1,
      category: 'Gratitude',
      categoryIcon: '🙏',
      taskPrompt: 'Write three things you\'re grateful for today',
      illustration: '/assets/landing-2/task-gratitude.png'
    },
    {
      id: 2,
      category: 'Reflection',
      categoryIcon: '💭',
      taskPrompt: 'What made you smile today?',
      illustration: '/assets/landing-2/task-reflection.png'
    },
    {
      id: 3,
      category: 'Mindfulness',
      categoryIcon: '🧘',
      taskPrompt: 'Take 5 deep breaths and notice how you feel',
      illustration: '/assets/landing-2/task-mindfulness.png'
    }
  ];

  const currentIndex = 0;

  return (
    <div className={styles.dailyTaskCarousel}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <div className={styles.categoryRow}>
              <span className={styles.categoryIcon}>{dailyTasks[currentIndex].categoryIcon}</span>
              <span className={styles.categoryName}>{dailyTasks[currentIndex].category}</span>
            </div>
            <p className={styles.taskPrompt}>{dailyTasks[currentIndex].taskPrompt}</p>
          </div>
          <div className={styles.illustrationSection}>
            <div 
              className={styles.illustration}
              style={{ backgroundImage: `url(${dailyTasks[currentIndex].illustration})` }}
              role="img"
              aria-label={`${dailyTasks[currentIndex].category} illustration`}
            />
          </div>
        </div>
      </div>

      <div className={styles.pagination}>
        {dailyTasks.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
