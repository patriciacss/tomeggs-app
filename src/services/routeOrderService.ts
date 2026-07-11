import { STORAGE_KEYS, storageService } from '../storage/storageService'
import type { Weekday } from '../types'
import { syncQueue } from './syncQueue'

export interface RouteOrderEntry {
  clientIds: string[]
  updatedAt: string
}

type RouteOrderMap = Partial<Record<Weekday, RouteOrderEntry>>

function getAllRaw(): RouteOrderMap {
  return storageService.get<RouteOrderMap>(STORAGE_KEYS.routeOrder, {})
}

function saveAllRaw(map: RouteOrderMap): void {
  storageService.set(STORAGE_KEYS.routeOrder, map)
}

/** Retorna os ids dos clientes na ordem salva para aquele dia da semana. */
function getOrder(weekday: Weekday): string[] {
  return getAllRaw()[weekday]?.clientIds ?? []
}

function getEntry(weekday: Weekday): RouteOrderEntry | undefined {
  return getAllRaw()[weekday]
}

/** Salva a ordem de visita dos clientes para um dia da semana específico. */
function setOrder(weekday: Weekday, clientIds: string[]): void {
  const all = getAllRaw()
  all[weekday] = { clientIds, updatedAt: new Date().toISOString() }
  saveAllRaw(all)
  syncQueue.queue('routeOrder', weekday)
}

/** Usado ao mesclar dados vindos da nuvem, sem gerar um novo item na fila. */
function setOrderFromSync(weekday: Weekday, entry: RouteOrderEntry): void {
  const all = getAllRaw()
  all[weekday] = entry
  saveAllRaw(all)
}

export const routeOrderService = {
  getOrder,
  getEntry,
  setOrder,
  setOrderFromSync,
}
