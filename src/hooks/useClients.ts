import { useCallback, useEffect, useState } from 'react'
import { clientService } from '../services/clientService'
import type { Client, ClientInput } from '../types'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])

  const refresh = useCallback(() => {
    setClients(clientService.getAll())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addClient = useCallback(
    (input: ClientInput) => {
      const client = clientService.add(input)
      refresh()
      return client
    },
    [refresh],
  )

  const updateClient = useCallback(
    (id: string, input: ClientInput) => {
      const client = clientService.update(id, input)
      refresh()
      return client
    },
    [refresh],
  )

  const removeClient = useCallback(
    (id: string) => {
      clientService.remove(id)
      refresh()
    },
    [refresh],
  )

  return { clients, addClient, updateClient, removeClient, refresh }
}
