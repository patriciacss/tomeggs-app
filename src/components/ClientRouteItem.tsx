import { useState } from 'react'
import { Card } from './ui/Card'
import { MapChooserModal } from './MapChooserModal'
import styles from './ClientRouteItem.module.css'
import type { Client } from '../types'

interface ClientRouteItemProps {
  client: Client
  visited: boolean
  noPurchase?: boolean
  onOpen: () => void
}

export function ClientRouteItem({ client, visited, noPurchase = false, onOpen }: ClientRouteItemProps) {
  const [showMap, setShowMap] = useState(false)

  return (
    <>
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
        <span
          className={`${styles.checkCircle} ${visited ? styles.checked : ''} ${noPurchase ? styles.declined : ''}`}
          aria-hidden="true"
        >
          {noPurchase ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="M6 12h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path
                d="M5 12.5L10 17.5L19 7"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>

        <div className={styles.info}>
          <p className={`${styles.name} ${visited && !noPurchase ? styles.nameDone : ''}`}>{client.name}</p>
          {noPurchase && <p className={styles.noPurchaseLabel}>Não quis comprar hoje</p>}
          {client.address && (
            <p
              className={styles.address}
              onClick={(event) => {
                event.stopPropagation()
                setShowMap(true)
              }}
            >
              {client.address}
            </p>
          )}
        </div>

        <span className={`${styles.arrowCircle} ${visited ? styles.arrowDone : ''}`} aria-label="Abrir">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Card>

      {showMap && client.address && (
        <MapChooserModal address={client.address} onClose={() => setShowMap(false)} />
      )}
    </>
  )
}
