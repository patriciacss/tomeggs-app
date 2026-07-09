import { STORAGE_KEYS, storageService } from '../storage/storageService'
import type { Client, Sale, Visit } from '../types'
import { todayISO } from '../utils/date'

function daysAgoISO(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Popula o app com clientes e vendas de exemplo, apenas se ainda não houver dados. */
export function seedDemoDataIfEmpty(): void {
  const alreadySeeded = storageService.get<boolean>(STORAGE_KEYS.seeded, false)
  if (alreadySeeded) return

  const existingClients = storageService.get<Client[]>(STORAGE_KEYS.clients, [])
  if (existingClients.length > 0) {
    storageService.set(STORAGE_KEYS.seeded, true)
    return
  }

  const clients: Client[] = [
    {
      id: 'seed-maria',
      name: 'Maria',
      address: 'Rua das Palmeiras, 120',
      phone: '(11) 98888-1010',
      notes: 'Prefere entrega até 8h.',
      deliveryDays: ['segunda', 'quarta', 'sexta'],
      createdAt: daysAgoISO(60),
    },
    {
      id: 'seed-joao',
      name: 'João',
      address: 'Av. Brasil, 455, casa 2',
      phone: '(11) 97777-2020',
      notes: '',
      deliveryDays: ['terca', 'quinta'],
      createdAt: daysAgoISO(50),
    },
    {
      id: 'seed-padaria-sol',
      name: 'Padaria Sol',
      address: 'Rua do Comércio, 88',
      phone: '(11) 3333-4455',
      notes: 'Comprar sempre em caixas fechadas de 30 dúzias.',
      deliveryDays: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
      createdAt: daysAgoISO(90),
    },
    {
      id: 'seed-mercado-central',
      name: 'Mercado Central',
      address: 'Praça Central, 10',
      phone: '(11) 3222-1199',
      notes: 'Falar com o Sr. Antônio no recebimento.',
      deliveryDays: ['sabado'],
      createdAt: daysAgoISO(40),
    },
  ]

  const today = todayISO()

  const sales: Sale[] = [
    {
      id: 'seed-sale-1',
      clientId: 'seed-maria',
      date: today,
      productType: 'branco',
      dozens: 3,
      unit: 'cartela',
      amount: 45,
      paid: true,
      paymentMethod: 'pix',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-sale-2',
      clientId: 'seed-maria',
      date: daysAgoISO(2),
      productType: 'vermelho',
      dozens: 2,
      unit: 'cartela',
      amount: 30,
      paid: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-sale-3',
      clientId: 'seed-joao',
      date: daysAgoISO(1),
      productType: 'caipira',
      dozens: 4,
      unit: 'cartela',
      amount: 60,
      paid: true,
      paymentMethod: 'dinheiro',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-sale-4',
      clientId: 'seed-padaria-sol',
      date: daysAgoISO(4),
      productType: 'branco',
      dozens: 30,
      unit: 'caixa',
      amount: 375,
      paid: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-sale-5',
      clientId: 'seed-padaria-sol',
      date: daysAgoISO(11),
      productType: 'branco',
      dozens: 30,
      unit: 'caixa',
      amount: 375,
      paid: true,
      paymentMethod: 'cartao',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-sale-6',
      clientId: 'seed-mercado-central',
      date: daysAgoISO(7),
      productType: 'codorna',
      dozens: 10,
      unit: 'cartela',
      amount: 140,
      paid: false,
      createdAt: new Date().toISOString(),
    },
  ]

  const visits: Visit[] = [
    {
      id: 'seed-visit-1',
      clientId: 'seed-maria',
      date: today,
      visitedAt: new Date().toISOString(),
    },
  ]

  storageService.set(STORAGE_KEYS.clients, clients)
  storageService.set(STORAGE_KEYS.sales, sales)
  storageService.set(STORAGE_KEYS.visits, visits)
  storageService.set(STORAGE_KEYS.seeded, true)
}
