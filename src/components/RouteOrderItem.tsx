import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { Card } from './ui/Card'
import styles from './RouteOrderItem.module.css'
import type { Client } from '../types'

interface RouteOrderItemProps {
  client: Client
  position: number
  dragging: boolean
  style?: CSSProperties
  onDragStart: (clientY: number) => void
  onOpen: () => void
}

export function RouteOrderItem({ client, position, dragging, style, onDragStart, onOpen }: RouteOrderItemProps) {
  function handlePointerDown(event: ReactPointerEvent) {
    if (event.button !== undefined && event.button !== 0) return
    onDragStart(event.clientY)
  }

  return (
    <Card
      className={`${styles.card} ${dragging ? styles.dragging : ''}`}
      style={style}
      data-route-item
    >
      <span className={styles.position}>{position}</span>

      <div
        className={styles.info}
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
        <p className={styles.name}>{client.name}</p>
        {client.address && <p className={styles.address}>{client.address}</p>}
      </div>

      <span
        className={styles.handle}
        onPointerDown={handlePointerDown}
        role="button"
        tabIndex={-1}
        aria-label={`Arrastar para reordenar ${client.name}`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <circle cx="9" cy="6" r="1.6" />
          <circle cx="15" cy="6" r="1.6" />
          <circle cx="9" cy="12" r="1.6" />
          <circle cx="15" cy="12" r="1.6" />
          <circle cx="9" cy="18" r="1.6" />
          <circle cx="15" cy="18" r="1.6" />
        </svg>
      </span>
    </Card>
  )
}
