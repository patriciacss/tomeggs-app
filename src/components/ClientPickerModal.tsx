import { useState } from 'react'
import { Modal } from './ui/Modal'
import styles from './ClientPickerModal.module.css'
import { useClients } from '../hooks/useClients'
import type { Client } from '../types'

interface ClientPickerModalProps {
  onClose: () => void
  onSelect: (client: Client) => void
}

export function ClientPickerModal({ onClose, onSelect }: ClientPickerModalProps) {
  const { clients } = useClients()
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const filtered = clients
    .filter((client) => !normalizedQuery || client.name.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

  return (
    <Modal title="Selecionar cliente" onClose={onClose}>
      <div className={styles.wrapper}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar cliente"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className={styles.list}>
          {filtered.length === 0 && <p className={styles.empty}>Nenhum cliente encontrado.</p>}
          {filtered.map((client) => (
            <button
              key={client.id}
              type="button"
              className={styles.clientRow}
              onClick={() => onSelect(client)}
            >
              {client.name}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}
