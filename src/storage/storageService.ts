// Serviço responsável por toda a comunicação com o localStorage.
// Nenhuma outra parte do app deve chamar window.localStorage diretamente.

export const STORAGE_KEYS = {
  clients: 'ovos_app:clients',
  sales: 'ovos_app:sales',
  visits: 'ovos_app:visits',
  seeded: 'ovos_app:seeded',
  syncOutbox: 'ovos_app:sync_outbox',
  lastSyncAt: 'ovos_app:last_sync_at',
  routeOrder: 'ovos_app:route_order',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

function isStorageAvailable(): boolean {
  try {
    const testKey = '__ovos_app_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export const storageService = {
  available: isStorageAvailable(),

  get<T>(key: StorageKey, fallback: T): T {
    if (!storageService.available) return fallback
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return fallback
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  },

  set<T>(key: StorageKey, value: T): void {
    if (!storageService.available) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Armazenamento cheio ou indisponível: falha silenciosamente,
      // a UI continua funcionando com o estado em memória da sessão.
    }
  },

  remove(key: StorageKey): void {
    if (!storageService.available) return
    window.localStorage.removeItem(key)
  },

  /** Lê todas as chaves conhecidas do app, usado para gerar o backup. */
  getAllRaw(): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const key of Object.values(STORAGE_KEYS)) {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) {
        try {
          result[key] = JSON.parse(raw)
        } catch {
          // ignora chaves corrompidas
        }
      }
    }
    return result
  },

  /** Restaura todas as chaves conhecidas a partir de um objeto de backup. */
  setAllRaw(data: Record<string, unknown>): void {
    for (const key of Object.values(STORAGE_KEYS)) {
      if (key in data) {
        window.localStorage.setItem(key, JSON.stringify(data[key]))
      }
    }
  },
}
