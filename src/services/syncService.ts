import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'
import { STORAGE_KEYS, storageService } from '../storage/storageService'
import { syncQueue } from './syncQueue'
import { clientService } from './clientService'
import { saleService } from './saleService'
import { visitService } from './visitService'
import { authService } from './authService'
import type { Client, PaymentMethod, ProductType, Sale, SaleUnit, Visit } from '../types'

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'offline' | 'not_configured'

export interface SyncState {
  status: SyncStatus
  lastSyncAt: string | null
  pendingCount: number
  error: string | null
  configured: boolean
}

type SyncListener = (state: SyncState) => void

interface DbClient {
  id: string
  user_id: string
  name: string
  address: string
  phone: string
  notes: string
  delivery_days: string[]
  created_at: string
  updated_at: string
  deleted: boolean
}

interface DbSale {
  id: string
  user_id: string
  client_id: string
  date: string
  product_type: ProductType
  dozens: number
  unit: SaleUnit
  amount: number
  paid: boolean
  payment_method: PaymentMethod | null
  created_at: string
  updated_at: string
  deleted: boolean
}

interface DbVisit {
  id: string
  user_id: string
  client_id: string
  date: string
  visited_at: string
  updated_at: string
  deleted: boolean
}

const listeners = new Set<SyncListener>()
let currentState: SyncState = buildState()
let syncing = false

function buildState(overrides: Partial<SyncState> = {}): SyncState {
  return {
    status: 'idle',
    lastSyncAt: storageService.get<string | null>(STORAGE_KEYS.lastSyncAt, null),
    pendingCount: syncQueue.getOutbox().length,
    error: null,
    configured: isSupabaseConfigured(),
    ...overrides,
  }
}

function notify(overrides: Partial<SyncState> = {}): void {
  currentState = { ...currentState, ...buildState(), ...overrides }
  for (const listener of listeners) {
    listener(currentState)
  }
}

function toDbClient(client: Client, userId: string): DbClient {
  return {
    id: client.id,
    user_id: userId,
    name: client.name,
    address: client.address,
    phone: client.phone,
    notes: client.notes,
    delivery_days: client.deliveryDays,
    created_at: client.createdAt,
    updated_at: client.updatedAt ?? client.createdAt,
    deleted: client.deleted ?? false,
  }
}

function fromDbClient(row: DbClient): Client {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone,
    notes: row.notes,
    deliveryDays: row.delivery_days as Client['deliveryDays'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deleted: row.deleted,
  }
}

function toDbSale(sale: Sale, userId: string): DbSale {
  return {
    id: sale.id,
    user_id: userId,
    client_id: sale.clientId,
    date: sale.date,
    product_type: sale.productType ?? 'branco',
    dozens: sale.dozens,
    unit: sale.unit ?? 'cartela',
    amount: sale.amount,
    paid: sale.paid,
    payment_method: sale.paymentMethod ?? null,
    created_at: sale.createdAt,
    updated_at: sale.updatedAt ?? sale.createdAt,
    deleted: sale.deleted ?? false,
  }
}

function fromDbSale(row: DbSale): Sale {
  return {
    id: row.id,
    clientId: row.client_id,
    date: row.date,
    productType: row.product_type,
    dozens: row.dozens,
    unit: row.unit ?? 'cartela',
    amount: row.amount,
    paid: row.paid,
    paymentMethod: row.payment_method ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deleted: row.deleted,
  }
}

function toDbVisit(visit: Visit, userId: string): DbVisit {
  return {
    id: visit.id,
    user_id: userId,
    client_id: visit.clientId,
    date: visit.date,
    visited_at: visit.visitedAt,
    updated_at: visit.updatedAt ?? visit.visitedAt,
    deleted: visit.deleted ?? false,
  }
}

function fromDbVisit(row: DbVisit): Visit {
  return {
    id: row.id,
    clientId: row.client_id,
    date: row.date,
    visitedAt: row.visited_at,
    updatedAt: row.updated_at,
    deleted: row.deleted,
  }
}

function getUpdatedAt(entity: { updatedAt?: string; createdAt?: string; visitedAt?: string }): string {
  return entity.updatedAt ?? entity.createdAt ?? entity.visitedAt ?? ''
}

async function pushOutbox(): Promise<string | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const userId = authService.getUserId()
  if (!userId) return null

  const outbox = syncQueue.getOutbox()
  const remaining = [...outbox]
  let lastError: string | null = null

  for (const item of outbox) {
    try {
      if (item.entity === 'client') {
        if (item.action === 'delete') {
          const { error, data } = await supabase
            .from('clients')
            .update({ deleted: true, updated_at: new Date().toISOString() })
            .eq('id', item.recordId)
            .select('id')
          if (error) throw error
          if (!data || data.length === 0) {
            throw new Error(`Não foi possível excluir o cliente ${item.recordId} na nuvem.`)
          }
        } else {
          const client = clientService.getById(item.recordId)
          if (!client) {
            remaining.splice(remaining.indexOf(item), 1)
            continue
          }
          const { error } = await supabase.from('clients').upsert(toDbClient(client, userId))
          if (error) throw error
        }
      }

      if (item.entity === 'sale') {
        if (item.action === 'delete') {
          const { error, data } = await supabase
            .from('sales')
            .update({ deleted: true, updated_at: new Date().toISOString() })
            .eq('id', item.recordId)
            .select('id')
          if (error) throw error
          if (!data || data.length === 0) {
            throw new Error(`Não foi possível excluir a venda ${item.recordId} na nuvem.`)
          }
        } else {
          const sale = saleService.getAll().find((entry) => entry.id === item.recordId)
          if (!sale) {
            remaining.splice(remaining.indexOf(item), 1)
            continue
          }
          const { error } = await supabase.from('sales').upsert(toDbSale(sale, userId))
          if (error) throw error
        }
      }

      if (item.entity === 'visit') {
        if (item.action === 'delete') {
          const { error, data } = await supabase
            .from('visits')
            .update({ deleted: true, updated_at: new Date().toISOString() })
            .eq('id', item.recordId)
            .select('id')
          if (error) throw error
          if (!data || data.length === 0) {
            throw new Error(`Não foi possível excluir a visita ${item.recordId} na nuvem.`)
          }
        } else {
          const visit = visitService.getAll().find((entry) => entry.id === item.recordId)
          if (!visit) {
            remaining.splice(remaining.indexOf(item), 1)
            continue
          }
          const { error } = await supabase.from('visits').upsert(toDbVisit(visit, userId))
          if (error) throw error
        }
      }

      remaining.splice(remaining.indexOf(item), 1)
    } catch (error) {
      // Mantém na fila para tentar novamente depois, mas registra o motivo.
      lastError = error instanceof Error ? error.message : 'Erro ao enviar alteração para a nuvem'
    }
  }

  syncQueue.saveOutbox(remaining)
  return lastError
}

function mergeClients(remoteRows: DbClient[]): void {
  const local = clientService.getAll()
  const byId = new Map(local.map((client) => [client.id, client]))

  for (const row of remoteRows) {
    const remote = fromDbClient(row)
    const existing = byId.get(remote.id)

    if (remote.deleted) {
      byId.delete(remote.id)
      continue
    }

    if (!existing || getUpdatedAt(remote) >= getUpdatedAt(existing)) {
      byId.set(remote.id, remote)
    }
  }

  storageService.set(STORAGE_KEYS.clients, Array.from(byId.values()))
}

function mergeSales(remoteRows: DbSale[]): void {
  const local = saleService.getAll()
  const byId = new Map(local.map((sale) => [sale.id, sale]))

  for (const row of remoteRows) {
    const remote = fromDbSale(row)
    const existing = byId.get(remote.id)

    if (remote.deleted) {
      byId.delete(remote.id)
      continue
    }

    if (!existing || getUpdatedAt(remote) >= getUpdatedAt(existing)) {
      byId.set(remote.id, remote)
    }
  }

  storageService.set(STORAGE_KEYS.sales, Array.from(byId.values()))
}

function mergeVisits(remoteRows: DbVisit[]): void {
  const local = visitService.getAll()
  const byId = new Map(local.map((visit) => [visit.id, visit]))

  for (const row of remoteRows) {
    const remote = fromDbVisit(row)
    const existing = byId.get(remote.id)

    if (remote.deleted) {
      byId.delete(remote.id)
      continue
    }

    if (!existing || getUpdatedAt(remote) >= getUpdatedAt(existing)) {
      byId.set(remote.id, remote)
    }
  }

  storageService.set(STORAGE_KEYS.visits, Array.from(byId.values()))
}

async function pullRemote(): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) return

  const lastSyncAt = storageService.get<string | null>(STORAGE_KEYS.lastSyncAt, null)
  const filter = lastSyncAt ? lastSyncAt : '1970-01-01T00:00:00.000Z'

  const [clientsResult, salesResult, visitsResult] = await Promise.all([
    supabase.from('clients').select('*').gt('updated_at', filter),
    supabase.from('sales').select('*').gt('updated_at', filter),
    supabase.from('visits').select('*').gt('updated_at', filter),
  ])

  if (clientsResult.error) throw clientsResult.error
  if (salesResult.error) throw salesResult.error
  if (visitsResult.error) throw visitsResult.error

  mergeClients((clientsResult.data ?? []) as DbClient[])
  mergeSales((salesResult.data ?? []) as DbSale[])
  mergeVisits((visitsResult.data ?? []) as DbVisit[])

  storageService.set(STORAGE_KEYS.lastSyncAt, new Date().toISOString())
}

async function syncNow(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    notify({ status: 'not_configured' })
    return false
  }

  if (!navigator.onLine) {
    notify({ status: 'offline' })
    return false
  }

  if (!authService.getUserId()) {
    notify({ status: 'not_configured' })
    return false
  }

  if (syncing) return false
  syncing = true
  notify({ status: 'syncing', error: null })

  try {
    const pushError = await pushOutbox()
    await pullRemote()
    if (pushError) {
      notify({ status: 'error', error: pushError })
      return false
    }
    notify({ status: 'success', error: null })
    return true
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao sincronizar'
    notify({ status: 'error', error: message })
    return false
  } finally {
    syncing = false
  }
}

function subscribe(listener: SyncListener): () => void {
  listeners.add(listener)
  listener(currentState)

  const unsubscribeQueue = syncQueue.subscribe(() => {
    notify()
  })

  return () => {
    listeners.delete(listener)
    unsubscribeQueue()
  }
}

function getState(): SyncState {
  return currentState
}

function initSync(): void {
  notify()

  if (!isSupabaseConfigured()) return

  window.addEventListener('online', () => {
    void syncNow()
  })

  if (navigator.onLine) {
    void syncNow()
  }
}

export const syncService = {
  syncNow,
  subscribe,
  getState,
  initSync,
  isConfigured: isSupabaseConfigured,
}
