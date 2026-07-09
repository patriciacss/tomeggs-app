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

export const visitService = {
  getAll,
  getByDate,
  isVisited,
  toggle,
  markVisited,
}
