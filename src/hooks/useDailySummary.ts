import { useCallback, useEffect, useState } from 'react'
import { clientService } from '../services/clientService'
import { saleService } from '../services/saleService'
import { visitService } from '../services/visitService'
import type { PaymentMethod } from '../types'
import { todayISO, todayWeekday } from '../utils/date'

export interface DailySummary {
  totalSold: number
  totalReceived: number
  totalPending: number
  visitedCount: number
  remainingCount: number
  totalsByMethod: Record<PaymentMethod | 'fiado', number>
}

const EMPTY_METHOD_TOTALS: Record<PaymentMethod | 'fiado', number> = {
  pix: 0,
  dinheiro: 0,
  cartao: 0,
  fiado: 0,
}

export function useDailySummary(date: string = todayISO()) {
  const [summary, setSummary] = useState<DailySummary>({
    totalSold: 0,
    totalReceived: 0,
    totalPending: 0,
    visitedCount: 0,
    remainingCount: 0,
    totalsByMethod: { ...EMPTY_METHOD_TOTALS },
  })

  const refresh = useCallback(() => {
    const sales = saleService.getByDate(date)
    const totalsByMethod: Record<PaymentMethod | 'fiado', number> = { ...EMPTY_METHOD_TOTALS }

    let totalSold = 0
    let totalReceived = 0
    let totalPending = 0

    for (const sale of sales) {
      totalSold += sale.amount
      if (sale.paid && sale.paymentMethod) {
        totalReceived += sale.amount
        totalsByMethod[sale.paymentMethod] += sale.amount
      } else {
        totalPending += sale.amount
        totalsByMethod.fiado += sale.amount
      }
    }

    const routeClients = clientService.getByWeekday(todayWeekday())
    const visitedCount = visitService.getByDate(date).length
    const remainingCount = Math.max(routeClients.length - visitedCount, 0)

    setSummary({
      totalSold,
      totalReceived,
      totalPending,
      visitedCount,
      remainingCount,
      totalsByMethod,
    })
  }, [date])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { summary, refresh }
}
