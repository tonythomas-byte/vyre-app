'use client'

import styles from './Checkbox.module.css'

interface CheckboxProps {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function Checkbox({ label, checked, onChange }: CheckboxProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(!checked)
  }

  if (label) {
    // With label (original behavior)
    return (
      <label className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={styles.checkboxInput}
        />
        <span className={styles.checkboxCustom}>
          {checked && <span className={styles.checkmark}>✓</span>}
        </span>
        <span className={styles.checkboxLabel}>{label}</span>
      </label>
    )
  }

  // Without label (standalone checkbox)
  return (
    <div className={styles.checkboxStandalone} onClick={handleClick}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.checkboxInput}
      />
      <span className={styles.checkboxCustom}>
        {checked && <span className={styles.checkmark}>✓</span>}
      </span>
    </div>
  )
}
