import { useCallback, useEffect, useState } from 'react'
import { clientService } from '../services/clientService'
import { visitService } from '../services/visitService'
import { saleService } from '../services/saleService'
import type { Client, Weekday } from '../types'
import { todayISO } from '../utils/date'

export interface RouteClient {
  client: Client
  visited: boolean
  /** Foi visitado hoje, mas não registrou nenhuma venda (recusou comprar). */
  noPurchase: boolean
}

export function useRouteForDay(weekday: Weekday, date: string = todayISO()) {
  const [routeClients, setRouteClients] = useState<RouteClient[]>([])

  const refresh = useCallback(() => {
    const clients = clientService.getByWeekday(weekday)
    const salesToday = saleService.getByDate(date)
    setRouteClients(
      clients.map((client) => {
        const hasSale = salesToday.some((sale) => sale.clientId === client.id)
        // Ter uma venda hoje já conta como "entregue", mesmo que tenha sido
        // registrada pelo perfil do cliente em vez da rota do dia.
        const visited = visitService.isVisited(client.id, date) || hasSale
        return { client, visited, noPurchase: visited && !hasSale }
      }),
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
