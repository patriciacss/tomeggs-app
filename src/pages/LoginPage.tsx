import { useState } from 'react'
import type { FormEvent } from 'react'
import { Card } from '../components/ui/Card'
import { TextField } from '../components/ui/TextField'
import { Button } from '../components/ui/Button'
import { authService } from '../services/authService'
import { EggFaceIcon } from '../components/FarmIcons'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const configured = authService.isConfigured()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return

    if (email.trim().length === 0 || password.length === 0) {
      setError('Informe e-mail e senha.')
      return
    }

    setError(null)
    setSubmitting(true)
    const message = await authService.signIn(email.trim(), password)
    setSubmitting(false)

    if (message) setError(message)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.logo} aria-hidden="true">
        <EggFaceIcon size={60} />
      </div>
      <h1 className={styles.title}>TomÉgg</h1>
      <p className={styles.subtitle}>Suas entregas, clientes e vendas em um só lugar.</p>

      <Card className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            label="E-mail"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={setEmail}
            placeholder="seuemail@exemplo.com"
          />
          <TextField
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth className={styles.submitButton} disabled={submitting || !configured}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </Button>

          {!configured && (
            <p className={styles.setupHint}>
              Configure o Supabase no arquivo <code>.env</code> para habilitar o login.
            </p>
          )}
        </form>
      </Card>
    </div>
  )
}
