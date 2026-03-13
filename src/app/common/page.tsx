import PageBackground from '@/components/PageBackground'
import styles from './common.module.css'

export default function CommonPage() {
  return (
    <PageBackground>
      <main className={styles.content}>
        <h1 className={styles.title}>Common Page</h1>
        <p className={styles.description}>
          This is a simple common page with the same background as other pages.
        </p>
      </main>
    </PageBackground>
  )
}