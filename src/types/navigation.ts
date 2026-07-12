export type Tab = 'rota' | 'resumo' | 'clientes' | 'backup'

// "View" representa a tela específica dentro da aba "rota" ou "clientes",
// que possuem navegação em profundidade (lista -> detalhe).
export type View =
  | { name: 'todayRoute' }
  | { name: 'weekdaySelect' }
  | { name: 'dayRoute'; weekday: import('../types').Weekday }
  | { name: 'clientDetail'; clientId: string; from: 'rota' | 'clientes' }
  | { name: 'clientsList' }
  | { name: 'clientForm'; clientId?: string }
  | { name: 'backup' }
  | { name: 'history' }
