import { useEffect, useState } from 'react'
import { syncService, type SyncState } from '../services/syncService'

export function useSync() {
  const [state, setState] = useState<SyncState>(syncService.getState())

  useEffect(() => syncService.subscribe(setState), [])

  return {
    ...state,
    syncNow: () => syncService.syncNow(),
  }
}
