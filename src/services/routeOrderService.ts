import { STORAGE_KEYS, storageService } from '../storage/storageService'
import type { Weekday } from '../types'

type RouteOrderMap = Partial<Record<Weekday, string[]>>

function getAll(): RouteOrderMap {
  return storageService.get<RouteOrderMap>(STORAGE_KEYS.routeOrder, {})
}

/** Retorna os ids dos clientes na ordem salva para aquele dia da semana. */
function getOrder(weekday: Weekday): string[] {
  return getAll()[weekday] ?? []
}

/** Salva a ordem de visita dos clientes para um dia da semana específico. */
function setOrder(weekday: Weekday, clientIds: string[]): void {
  const all = getAll()
  all[weekday] = clientIds
  storageService.set(STORAGE_KEYS.routeOrder, all)
}

export const routeOrderService = {
  getOrder,
  setOrder,
}
