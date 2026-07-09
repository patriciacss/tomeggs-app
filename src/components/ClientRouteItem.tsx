import { Card } from './ui/Card'
import styles from './ClientRouteItem.module.css'
import type { Client } from '../types'

interface ClientRouteItemProps {
  client: Client
  visited: boolean
  onOpen: () => void
}

export function ClientRouteItem({ client, visited, onOpen }: ClientRouteItemProps) {
  return (
    <Card
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <span className={`${styles.checkCircle} ${visited ? styles.checked : ''}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path
            d="M5 12.5L10 17.5L19 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <div className={styles.info}>
        <p className={`${styles.name} ${visited ? styles.nameDone : ''}`}>{client.name}</p>
        {client.address && <p className={styles.address}>{client.address}</p>}
      </div>

      <span className={`${styles.arrowCircle} ${visited ? styles.arrowDone : ''}`} aria-label="Abrir">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Card>
  )
}
