import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import styles from './TextField.module.css'

interface TextAreaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string
  multiline: true
  onChange: (value: string) => void
}

interface SingleLineProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  multiline?: false
  onChange: (value: string) => void
}

export function TextField(props: SingleLineProps | TextAreaFieldProps) {
  const { label, multiline, onChange, id, ...rest } = props
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={styles.wrapper}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={fieldId}
          className={styles.textarea}
          onChange={(event) => onChange(event.target.value)}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fieldId}
          className={styles.input}
          onChange={(event) => onChange(event.target.value)}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  )
}
