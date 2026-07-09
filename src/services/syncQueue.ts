import { STORAGE_KEYS, storageService } from '../storage/storageService'
import { isSupabaseConfigured } from '../lib/supabase'

type SyncEntity = 'client' | 'sale' | 'visit'

export interface OutboxItem {
  id: string
  entity: SyncEntity
  recordId: string
  action: 'upsert' | 'delete'
  createdAt: string
}

type QueueListener = (pendingCount: number) => void

const listeners = new Set<QueueListener>()

function getOutbox(): OutboxItem[] {
  return storageService.get<OutboxItem[]>(STORAGE_KEYS.syncOutbox, [])
}

function saveOutbox(items: OutboxItem[]): void {
  storageService.set(STORAGE_KEYS.syncOutbox, items)
  for (const listener of listeners) {
    listener(items.length)
  }
}

function notifySync(): void {
  if (!isSupabaseConfigured() || !navigator.onLine) return
  import('./syncService').then(({ syncService }) => syncService.syncNow())
}

function queue(entity: SyncEntity, recordId: string, action: 'upsert' | 'delete' = 'upsert'): void {
  if (!isSupabaseConfigured()) return

  const outbox = getOutbox().filter(
    (item) => !(item.entity === entity && item.recordId === recordId),
  )
  outbox.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    entity,
    recordId,
    action,
    createdAt: new Date().toISOString(),
  })
  saveOutbox(outbox)
  notifySync()
}

function subscribe(listener: QueueListener): () => void {
  listeners.add(listener)
  listener(getOutbox().length)
  return () => listeners.delete(listener)
}

export const syncQueue = {
  getOutbox,
  saveOutbox,
  queue,
  subscribe,
}
