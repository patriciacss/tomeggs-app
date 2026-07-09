import { useState } from 'react'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import styles from './BackupPage.module.css'
import { useSync } from '../hooks/useSync'
import { authService } from '../services/authService'

function formatSyncTime(iso: string | null): string {
  if (!iso) return 'Nunca sincronizado'
  return new Date(iso).toLocaleString('pt-BR')
}

function syncStatusLabel(status: string, pendingCount: number): string {
  switch (status) {
    case 'syncing':
      return 'Sincronizando...'
    case 'success':
      return pendingCount > 0 ? `${pendingCount} alteração(ões) pendente(s)` : 'Sincronizado'
    case 'offline':
      return pendingCount > 0
        ? `Offline — ${pendingCount} alteração(ões) aguardando`
        : 'Offline — dados salvos localmente'
    case 'error':
      return 'Erro na sincronização'
    case 'not_configured':
      return 'Nuvem não configurada'
    default:
      return pendingCount > 0 ? `${pendingCount} alteração(ões) pendente(s)` : 'Pronto'
  }
}

export function BackupPage() {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const sync = useSync()

  function handleLogout() {
    const confirmed = window.confirm('Sair da conta? Os dados continuam salvos neste aparelho.')
    if (!confirmed) return
    void authService.signOut()
  }

  async function handleSync() {
    const ok = await sync.syncNow()
    if (ok) {
      setFeedback({ type: 'success', message: 'Dados sincronizados com a nuvem.' })
    } else if (sync.status === 'offline') {
      setFeedback({ type: 'error', message: 'Sem conexão. Os dados continuam salvos neste aparelho.' })
    } else if (sync.status === 'not_configured') {
      setFeedback({
        type: 'error',
        message: 'Configure o Supabase no arquivo .env para ativar a sincronização.',
      })
    } else if (sync.error) {
      setFeedback({ type: 'error', message: sync.error })
    }
  }

  return (
    <div>
      <ScreenHeader
        title="Backup"
        subtitle={
          sync.configured
            ? 'Dados salvos localmente e sincronizados na nuvem'
            : 'Seus dados ficam salvos neste aparelho'
        }
      />
      <div className={styles.content}>
        <Card>
          <h2 className={styles.title}>Sincronização na nuvem</h2>
          <p className={styles.description}>
            O app funciona offline: tudo é salvo primeiro no celular. Quando houver internet, os dados são
            enviados automaticamente para o Supabase (plano gratuito).
          </p>
          <p className={styles.syncStatus}>
            Status: <strong>{syncStatusLabel(sync.status, sync.pendingCount)}</strong>
          </p>
          <p className={styles.syncMeta}>Última sincronização: {formatSyncTime(sync.lastSyncAt)}</p>
          <Button fullWidth onClick={handleSync} disabled={sync.status === 'syncing' || !sync.configured}>
            {sync.status === 'syncing' ? 'Sincronizando...' : 'Sincronizar agora'}
          </Button>
          {!sync.configured && (
            <p className={styles.setupHint}>
              Crie um projeto gratuito em supabase.com, execute o SQL em <code>supabase/schema.sql</code> e
              configure as variáveis no arquivo <code>.env</code>.
            </p>
          )}
        </Card>

        {feedback && (
          <p className={feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}>
            {feedback.message}
          </p>
        )}

        {sync.configured && (
          <Card>
            <h2 className={styles.title}>Conta</h2>
            {authService.getUserEmail() && (
              <p className={styles.description}>Logado como {authService.getUserEmail()}</p>
            )}
            <Button variant="secondary" fullWidth onClick={handleLogout}>
              Sair da conta
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
