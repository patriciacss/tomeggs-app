import styles from './Checkbox.module.css'

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  label?: string
  ariaLabel?: string
}

export function Checkbox({ checked, onChange, label, ariaLabel }: CheckboxProps) {
  return (
    <label className={styles.wrapper}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel ?? label}
        className={styles.input}
      />
      <span className={`${styles.box} ${checked ? styles.checked : ''}`} aria-hidden="true">
        {checked && (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M5 12.5L10 17.5L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
