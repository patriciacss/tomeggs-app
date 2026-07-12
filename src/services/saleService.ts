import { STORAGE_KEYS, storageService } from '../storage/storageService'
import type { PaymentMethod, ProductType, Sale, SaleInput, SaleUnit } from '../types'
import { generateId } from '../utils/id'
import { syncQueue } from './syncQueue'

function normalizeSale(sale: Sale): Sale {
  return {
    ...sale,
    productType: sale.productType ?? ('branco' as ProductType),
    unit: sale.unit ?? 'cartela',
  }
}

function getAll(): Sale[] {
  return storageService.get<Sale[]>(STORAGE_KEYS.sales, []).map(normalizeSale)
}

function saveAll(sales: Sale[]): void {
  storageService.set(STORAGE_KEYS.sales, sales)
}

function getByClient(clientId: string): Sale[] {
  return getAll()
    .filter((sale) => sale.clientId === clientId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

function getByDate(date: string): Sale[] {
  return getAll().filter((sale) => sale.date === date)
}

function add(input: SaleInput): Sale {
  const now = new Date().toISOString()
  const sale: Sale = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const sales = getAll()
  sales.push(sale)
  saveAll(sales)
  syncQueue.queue('sale', sale.id)
  return sale
}

function remove(id: string): void {
  syncQueue.queue('sale', id, 'delete')
  saveAll(getAll().filter((sale) => sale.id !== id))
}

/** Remove todas as vendas de um cliente (usado ao excluir o cliente). */
function removeByClient(clientId: string): void {
  for (const sale of getByClient(clientId)) {
    remove(sale.id)
  }
}

/** Remove vendas cujo cliente não existe mais (limpeza de dados órfãos). Vendas avulsas (sem clientId) nunca são órfãs. */
function removeOrphans(validClientIds: Set<string>): void {
  for (const sale of getAll()) {
    if (sale.clientId && !validClientIds.has(sale.clientId)) {
      remove(sale.id)
    }
  }
}

export type SaleEditInput = {
  date: string
  productType: ProductType
  dozens: number
  unit: SaleUnit
  amount: number
  paid: boolean
  paymentMethod?: PaymentMethod
}

/** Atualiza os dados de uma venda já registrada (editar pedido). */
function update(id: string, input: SaleEditInput): Sale | undefined {
  const sales = getAll()
  const index = sales.findIndex((sale) => sale.id === id)
  if (index === -1) return undefined

  const updated: Sale = {
    ...sales[index],
    ...input,
    paymentMethod: input.paid ? input.paymentMethod : undefined,
    updatedAt: new Date().toISOString(),
  }
  sales[index] = updated
  saveAll(sales)
  syncQueue.queue('sale', id)
  return updated
}

/** Marca uma venda como paga, informando a forma de pagamento usada. */
function markPaid(id: string, paymentMethod: PaymentMethod): Sale | undefined {
  const sales = getAll()
  const index = sales.findIndex((sale) => sale.id === id)
  if (index === -1) return undefined

  const updated: Sale = {
    ...sales[index],
    paid: true,
    paymentMethod,
    updatedAt: new Date().toISOString(),
  }
  sales[index] = updated
  saveAll(sales)
  syncQueue.queue('sale', id)
  return updated
}

/** Agrupa as vendas de um cliente por data, retornando um mapa data -> vendas. */
function groupByDate(sales: Sale[]): Map<string, Sale[]> {
  const grouped = new Map<string, Sale[]>()
  for (const sale of sales) {
    const list = grouped.get(sale.date) ?? []
    list.push(sale)
    grouped.set(sale.date, list)
  }
  return grouped
}

/** Soma o total pendente (não pago) de um conjunto de vendas. */
function totalPending(sales: Sale[]): number {
  return sales
    .filter((sale) => !sale.paid)
    .reduce((sum, sale) => sum + sale.amount, 0)
}

export const saleService = {
  getAll,
  getByClient,
  getByDate,
  add,
  update,
  remove,
  removeByClient,
  removeOrphans,
  markPaid,
  groupByDate,
  totalPending,
}
