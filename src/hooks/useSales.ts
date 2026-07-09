import { useCallback, useEffect, useState } from 'react'
import { saleService } from '../services/saleService'
import type { PaymentMethod, Sale, SaleInput } from '../types'

export function useSales(clientId: string) {
  const [sales, setSales] = useState<Sale[]>([])

  const refresh = useCallback(() => {
    setSales(saleService.getByClient(clientId))
  }, [clientId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addSale = useCallback(
    (input: SaleInput) => {
      const sale = saleService.add(input)
      refresh()
      return sale
    },
    [refresh],
  )

  const removeSale = useCallback(
    (id: string) => {
      saleService.remove(id)
      refresh()
    },
    [refresh],
  )

  const markSalePaid = useCallback(
    (id: string, paymentMethod: PaymentMethod) => {
      saleService.markPaid(id, paymentMethod)
      refresh()
    },
    [refresh],
  )

  return { sales, addSale, removeSale, markSalePaid, refresh }
}
