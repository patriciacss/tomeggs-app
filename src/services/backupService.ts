import { storageService } from '../storage/storageService'

interface BackupFile {
  app: 'ovos-app'
  version: 1
  exportedAt: string
  data: Record<string, unknown>
}

function exportBackup(): void {
  const backup: BackupFile = {
    app: 'ovos-app',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: storageService.getAllRaw(),
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const dateStamp = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `ovos-app-backup-${dateStamp}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Lê um arquivo de backup e restaura os dados. Retorna erro em texto se falhar. */
async function importBackup(file: File): Promise<{ success: boolean; error?: string }> {
  try {
    const text = await file.text()
    const parsed = JSON.parse(text) as Partial<BackupFile>

    if (parsed.app !== 'ovos-app' || !parsed.data || typeof parsed.data !== 'object') {
      return { success: false, error: 'Arquivo inválido. Selecione um backup gerado por este app.' }
    }

    storageService.setAllRaw(parsed.data)
    return { success: true }
  } catch {
    return { success: false, error: 'Não foi possível ler o arquivo. Verifique se é um JSON válido.' }
  }
}

export const backupService = {
  exportBackup,
  importBackup,
}
