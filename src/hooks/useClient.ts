import { useCallback, useEffect, useState } from 'react'
import { clientService } from '../services/clientService'
import type { Client } from '../types'

export function useClient(clientId: string) {
  const [client, setClient] = useState<Client | undefined>(undefined)

  const refresh = useCallback(() => {
    setClient(clientService.getById(clientId))
  }, [clientId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { client, refresh }
}
