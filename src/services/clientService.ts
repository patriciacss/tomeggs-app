import { STORAGE_KEYS, storageService } from '../storage/storageService'
import type { Client, ClientInput, Weekday } from '../types'
import { generateId } from '../utils/id'
import { syncQueue } from './syncQueue'
import { routeOrderService } from './routeOrderService'
import { saleService } from './saleService'
import { visitService } from './visitService'

function getAll(): Client[] {
  return storageService.get<Client[]>(STORAGE_KEYS.clients, [])
}

function saveAll(clients: Client[]): void {
  storageService.set(STORAGE_KEYS.clients, clients)
}

function getById(id: string): Client | undefined {
  return getAll().find((client) => client.id === id)
}

function getByWeekday(weekday: Weekday): Client[] {
  const order = routeOrderService.getOrder(weekday)
  const position = new Map(order.map((clientId, index) => [clientId, index]))

  return getAll()
    .filter((client) => client.deliveryDays.includes(weekday))
    .sort((a, b) => {
      const posA = position.get(a.id) ?? Number.MAX_SAFE_INTEGER
      const posB = position.get(b.id) ?? Number.MAX_SAFE_INTEGER
      if (posA !== posB) return posA - posB
      return a.name.localeCompare(b.name, 'pt-BR')
    })
}

/** Salva a nova ordem de visita dos clientes para um dia da semana específico. */
function reorderForWeekday(weekday: Weekday, orderedClientIds: string[]): void {
  routeOrderService.setOrder(weekday, orderedClientIds)
}

function add(input: ClientInput): Client {
  const now = new Date().toISOString()
  const client: Client = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const clients = getAll()
  clients.push(client)
  saveAll(clients)
  syncQueue.queue('client', client.id)
  return client
}

function update(id: string, input: ClientInput): Client | undefined {
  const clients = getAll()
  const index = clients.findIndex((client) => client.id === id)
  if (index === -1) return undefined
  const updated: Client = {
    ...clients[index],
    ...input,
    updatedAt: new Date().toISOString(),
  }
  clients[index] = updated
  saveAll(clients)
  syncQueue.queue('client', id)
  return updated
}

function remove(id: string): void {
  saleService.removeByClient(id)
  visitService.removeByClient(id)
  syncQueue.queue('client', id, 'delete')
  saveAll(getAll().filter((client) => client.id !== id))
}

export const clientService = {
  getAll,
  getById,
  getByWeekday,
  reorderForWeekday,
  add,
  update,
  remove,
}
