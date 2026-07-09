import type { SelectHTMLAttributes } from 'react'
import styles from './SelectField.module.css'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string
  options: SelectOption[]
  onChange: (value: string) => void
}

export function SelectField({ label, options, onChange, id, value, ...rest }: SelectFieldProps) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={styles.wrapper}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>
      <select
        id={fieldId}
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
