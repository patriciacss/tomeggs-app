import type { Session } from '@supabase/supabase-js'
import { AUTH_STORAGE_KEY, getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'

export type AuthListener = (session: Session | null) => void

const listeners = new Set<AuthListener>()
let currentSession: Session | null = null
let initialized = false

function notify(): void {
  for (const listener of listeners) listener(currentSession)
}

/**
 * Checagem síncrona (sem rede) se há uma sessão salva neste aparelho.
 * Usada para abrir o app direto quando offline, em vez de esperar o
 * getSession() assíncrono e travar a tela em um "carregando".
 */
function hasPersistedSession(): boolean {
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) !== null
  } catch {
    return false
  }
}

async function init(): Promise<void> {
  if (initialized) return
  initialized = true

  const supabase = getSupabaseClient()
  if (!supabase) {
    notify()
    return
  }

  const { data } = await supabase.auth.getSession()
  currentSession = data.session
  notify()

  supabase.auth.onAuthStateChange((_event, session) => {
    currentSession = session
    notify()
  })
}

function subscribe(listener: AuthListener): () => void {
  listeners.add(listener)
  if (initialized) listener(currentSession)
  return () => listeners.delete(listener)
}

function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (message.includes('Email not confirmed')) return 'E-mail ainda não confirmado.'
  if (message.toLowerCase().includes('fetch')) return 'Sem conexão com a internet.'
  return 'Não foi possível entrar. Tente novamente.'
}

async function signIn(email: string, password: string): Promise<string | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return 'Supabase não configurado neste app.'

  if (!navigator.onLine) {
    return 'Sem conexão. É preciso internet para entrar pela primeira vez neste aparelho.'
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return translateAuthError(error.message)
    return null
  } catch {
    return 'Sem conexão com a internet.'
  }
}

async function signOut(): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) return
  await supabase.auth.signOut()
}

function getUserId(): string | null {
  return currentSession?.user.id ?? null
}

function getUserEmail(): string | null {
  return currentSession?.user.email ?? null
}

export const authService = {
  init,
  subscribe,
  signIn,
  signOut,
  getUserId,
  getUserEmail,
  hasPersistedSession,
  isConfigured: isSupabaseConfigured,
}
