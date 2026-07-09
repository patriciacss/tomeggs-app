import type { ReactNode } from 'react'
import styles from './ScreenHeader.module.css'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  action?: ReactNode
}

export function ScreenHeader({ title, subtitle, onBack, action }: ScreenHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        {onBack && (
          <button type="button" className={styles.backButton} onClick={onBack} aria-label="Voltar">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M15 5L8 12L15 19"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </header>
  )
}
