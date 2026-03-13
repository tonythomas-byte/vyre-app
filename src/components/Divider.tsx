import styles from './Divider.module.css'

interface DividerProps {
  text?: string
}

export default function Divider({ text }: DividerProps) {
  return (
    <div className={styles.divider}>
      <div className={styles.line} />
      {text && <span className={styles.text}>{text}</span>}
      {text && <div className={styles.line} />}
    </div>
  )
}
