import { useState } from 'react'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import styles from './ClientsListPage.module.css'
import { useClients } from '../hooks/useClients'
import { WEEKDAYS } from '../types'

interface ClientsListPageProps {
  onOpenClient: (clientId: string) => void
  onAddClient: () => void
}

export function ClientsListPage({ onOpenClient, onAddClient }: ClientsListPageProps) {
  const { clients } = useClients()
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()

  const filtered = clients
    .filter((client) => {
      if (!normalizedQuery) return true
      return (
        client.name.toLowerCase().includes(normalizedQuery) ||
        client.address.toLowerCase().includes(normalizedQuery)
      )
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

  return (
    <div>
      <ScreenHeader
        title="Clientes"
        subtitle={`${clients.length} cadastrados`}
        action={
          <Button variant="ghost" onClick={onAddClient}>
            + Novo
          </Button>
        }
      />

      <div className={styles.searchBar}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" className={styles.searchIcon}>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar cliente"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && (
          <Card>
            <p className={styles.empty}>
              {clients.length === 0
                ? 'Nenhum cliente cadastrado ainda. Toque em "+ Novo" para começar.'
                : 'Nenhum cliente encontrado.'}
            </p>
          </Card>
        )}
        {filtered.map((client) => {
          const days = client.deliveryDays
            .map((day) => WEEKDAYS.find((option) => option.value === day)?.shortLabel)
            .filter(Boolean)
            .join(', ')
          return (
            <Card
              key={client.id}
              className={styles.item}
              role="button"
              tabIndex={0}
              onClick={() => onOpenClient(client.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onOpenClient(client.id)
              }}
            >
              <div>
                <p className={styles.name}>{client.name}</p>
                <p className={styles.days}>{days || 'Sem dias de entrega definidos'}</p>
              </div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
