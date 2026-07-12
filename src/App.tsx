import { useEffect, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { TodayRoutePage } from './pages/TodayRoutePage'
import { WeekdaySelectPage } from './pages/WeekdaySelectPage'
import { DayRoutePage } from './pages/DayRoutePage'
import { ClientDetailPage } from './pages/ClientDetailPage'
import { ClientsListPage } from './pages/ClientsListPage'
import { ClientFormPage } from './pages/ClientFormPage'
import { BackupPage } from './pages/BackupPage'
import { HistoryPage } from './pages/HistoryPage'
import { LoginPage } from './pages/LoginPage'
import { NewSaleChoiceModal } from './components/NewSaleChoiceModal'
import { ClientPickerModal } from './components/ClientPickerModal'
import { SaleQuickModal } from './components/SaleQuickModal'
import { WalkupSaleModal } from './components/WalkupSaleModal'
import { syncService } from './services/syncService'
import { authService } from './services/authService'
import type { Client } from './types'
import type { Tab, View } from './types/navigation'

type AuthPhase = 'checking' | 'authed' | 'guest'

type SaleFlow = 'choice' | 'pickClient' | { step: 'clientSale'; client: Client } | 'walkup' | null

// Sessão salva localmente já responde de forma otimista (offline-first);
// só ficamos em "checking" quando é preciso perguntar ao Supabase se há
// alguém logado neste aparelho.
function initialAuthPhase(): AuthPhase {
  if (!authService.isConfigured()) return 'guest'
  return authService.hasPersistedSession() ? 'authed' : 'checking'
}

function rootViewForTab(tab: Tab): View {
  switch (tab) {
    case 'rota':
      return { name: 'todayRoute' }
    case 'clientes':
      return { name: 'clientsList' }
    case 'resumo':
      return { name: 'weekdaySelect' }
    case 'backup':
      return { name: 'backup' }
  }
}

export default function App() {
  const [authPhase, setAuthPhase] = useState<AuthPhase>(initialAuthPhase)

  useEffect(() => {
    const unsubscribe = authService.subscribe((session) => {
      setAuthPhase(session ? 'authed' : 'guest')
    })
    authService.init()
    return unsubscribe
  }, [])

  useEffect(() => {
    if (authPhase !== 'authed') return
    syncService.initSync()
  }, [authPhase])

  const [activeTab, setActiveTab] = useState<Tab>('rota')
  // Pilha de navegação: o último item é a tela atual. Voltar remove o topo.
  const [stack, setStack] = useState<View[]>([{ name: 'todayRoute' }])
  const view = stack[stack.length - 1]

  // Fluxo do botão "+" (registrar venda), independente da navegação principal.
  const [saleFlow, setSaleFlow] = useState<SaleFlow>(null)
  // Incrementado ao salvar uma venda pelo "+", força a tela atual a recarregar seus dados.
  const [dataVersion, setDataVersion] = useState(0)

  function handleSaleSaved() {
    setSaleFlow(null)
    setDataVersion((version) => version + 1)
  }

  function handleSelectTab(tab: Tab) {
    setActiveTab(tab)
    setStack([rootViewForTab(tab)])
  }

  function push(next: View) {
    setStack((current) => [...current, next])
  }

  function goBack() {
    setStack((current) => (current.length > 1 ? current.slice(0, -1) : current))
  }

  /** Substitui a tela atual (usado ao concluir cadastro/edição, sem empilhar). */
  function replace(next: View) {
    setStack((current) => [...current.slice(0, -1), next])
  }

  function renderView() {
    switch (view.name) {
      case 'todayRoute':
        return (
          <TodayRoutePage
            onOpenClient={(clientId) => push({ name: 'clientDetail', clientId, from: 'rota' })}
            onManageClients={() => {
              setActiveTab('clientes')
              setStack([{ name: 'clientsList' }])
            }}
            onOpenHistory={() => push({ name: 'history' })}
          />
        )

      case 'weekdaySelect':
        return <WeekdaySelectPage onSelect={(weekday) => push({ name: 'dayRoute', weekday })} />

      case 'dayRoute':
        return (
          <DayRoutePage
            weekday={view.weekday}
            onBack={goBack}
            onOpenClient={(clientId) => push({ name: 'clientDetail', clientId, from: 'rota' })}
          />
        )

      case 'clientsList':
        return (
          <ClientsListPage
            onOpenClient={(clientId) => push({ name: 'clientDetail', clientId, from: 'clientes' })}
            onAddClient={() => push({ name: 'clientForm' })}
          />
        )

      case 'clientDetail':
        return (
          <ClientDetailPage
            clientId={view.clientId}
            onBack={goBack}
            onEdit={(clientId) => push({ name: 'clientForm', clientId })}
          />
        )

      case 'clientForm':
        return (
          <ClientFormPage
            clientId={view.clientId}
            onBack={goBack}
            onSaved={(clientId) => {
              if (activeTab !== 'clientes') {
                setActiveTab('clientes')
                setStack([{ name: 'clientsList' }, { name: 'clientDetail', clientId, from: 'clientes' }])
                return
              }
              replace({ name: 'clientDetail', clientId, from: 'clientes' })
            }}
          />
        )

      case 'backup':
        return <BackupPage />

      case 'history':
        return <HistoryPage onBack={goBack} />
    }
  }

  if (authPhase === 'checking') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
        }}
        aria-hidden="true"
      >
        🥚
      </div>
    )
  }

  if (authPhase === 'guest') {
    return <LoginPage />
  }

  return (
    <>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div key={dataVersion} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {renderView()}
        </div>
      </main>
      <BottomNav activeTab={activeTab} onSelect={handleSelectTab} onAddSale={() => setSaleFlow('choice')} />

      {saleFlow === 'choice' && (
        <NewSaleChoiceModal
          onClose={() => setSaleFlow(null)}
          onPickClient={() => setSaleFlow('pickClient')}
          onWalkup={() => setSaleFlow('walkup')}
        />
      )}

      {saleFlow === 'pickClient' && (
        <ClientPickerModal
          onClose={() => setSaleFlow(null)}
          onSelect={(client) => setSaleFlow({ step: 'clientSale', client })}
        />
      )}

      {typeof saleFlow === 'object' && saleFlow?.step === 'clientSale' && (
        <SaleQuickModal
          client={saleFlow.client}
          onClose={() => setSaleFlow(null)}
          onSaved={handleSaleSaved}
        />
      )}

      {saleFlow === 'walkup' && (
        <WalkupSaleModal onClose={() => setSaleFlow(null)} onSaved={handleSaleSaved} />
      )}
    </>
  )
}
