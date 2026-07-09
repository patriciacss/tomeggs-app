import styles from './ChipToggleGroup.module.css'

interface Option<T extends string> {
  value: T
  label: string
}

interface ChipToggleGroupProps<T extends string> {
  label?: string
  options: Option<T>[]
  values: T[]
  onChange: (values: T[]) => void
}

export function ChipToggleGroup<T extends string>({
  label,
  options,
  values,
  onChange,
}: ChipToggleGroupProps<T>) {
  function toggle(value: T) {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value))
    } else {
      onChange([...values, value])
    }
  }

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.grid}>
        {options.map((option) => {
          const selected = values.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              className={`${styles.chip} ${selected ? styles.selected : ''}`}
              onClick={() => toggle(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
