import { STORAGE_KEYS, storageService } from '../storage/storageService'
import type { Visit } from '../types'
import { generateId } from '../utils/id'
import { syncQueue } from './syncQueue'

function getAll(): Visit[] {
  return storageService.get<Visit[]>(STORAGE_KEYS.visits, [])
}

function saveAll(visits: Visit[]): void {
  storageService.set(STORAGE_KEYS.visits, visits)
}

function getByDate(date: string): Visit[] {
  return getAll().filter((visit) => visit.date === date)
}

function getByClient(clientId: string): Visit[] {
  return getAll()
    .filter((visit) => visit.clientId === clientId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

function isVisited(clientId: string, date: string): boolean {
  return getAll().some((visit) => visit.clientId === clientId && visit.date === date)
}

/** Alterna o status de visita de um cliente em uma data (marca ou desmarca). */
function toggle(clientId: string, date: string): void {
  const visits = getAll()
  const existing = visits.find((visit) => visit.clientId === clientId && visit.date === date)
  if (existing) {
    syncQueue.queue('visit', existing.id, 'delete')
    saveAll(visits.filter((visit) => visit.id !== existing.id))
    return
  }
  const now = new Date().toISOString()
  const visit: Visit = {
    id: generateId(),
    clientId,
    date,
    visitedAt: now,
    updatedAt: now,
  }
  visits.push(visit)
  saveAll(visits)
  syncQueue.queue('visit', visit.id)
}

/** Marca um cliente como visitado em uma data, se ainda não estiver (idempotente). */
function markVisited(clientId: string, date: string): void {
  if (isVisited(clientId, date)) return
  toggle(clientId, date)
}

function remove(id: string): void {
  syncQueue.queue('visit', id, 'delete')
  saveAll(getAll().filter((visit) => visit.id !== id))
}

/** Remove todas as visitas de um cliente (usado ao excluir o cliente). */
function removeByClient(clientId: string): void {
  for (const visit of getAll().filter((entry) => entry.clientId === clientId)) {
    remove(visit.id)
  }
}

/** Remove visitas cujo cliente não existe mais (limpeza de dados órfãos). */
function removeOrphans(validClientIds: Set<string>): void {
  for (const visit of getAll()) {
    if (!validClientIds.has(visit.clientId)) {
      remove(visit.id)
    }
  }
}

export const visitService = {
  getAll,
  getByDate,
  getByClient,
  isVisited,
  toggle,
  markVisited,
  remove,
  removeByClient,
  removeOrphans,
}
