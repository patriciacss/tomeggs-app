import { useCallback, useEffect, useState } from 'react'
import { clientService } from '../services/clientService'
import { visitService } from '../services/visitService'
import type { Client, Weekday } from '../types'
import { todayISO } from '../utils/date'

export interface RouteClient {
  client: Client
  visited: boolean
}

export function useRouteForDay(weekday: Weekday, date: string = todayISO()) {
  const [routeClients, setRouteClients] = useState<RouteClient[]>([])

  const refresh = useCallback(() => {
    const clients = clientService.getByWeekday(weekday)
    setRouteClients(
      clients.map((client) => ({
        client,
        visited: visitService.isVisited(client.id, date),
      })),
    )
  }, [weekday, date])

  useEffect(() => {
    refresh()
  }, [refresh])

  const toggleVisited = useCallback(
    (clientId: string) => {
      visitService.toggle(clientId, date)
      refresh()
    },
    [date, refresh],
  )

  return { routeClients, toggleVisited, refresh }
}
