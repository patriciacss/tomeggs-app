import { useState } from 'react'
import { ClientRouteItem } from '../components/ClientRouteItem'
import { SaleChoiceModal } from '../components/SaleChoiceModal'
import { SaleQuickModal } from '../components/SaleQuickModal'
import { DailySalesModal } from '../components/DailySalesModal'
import { ChickIcon, CoinIcon, CoopIcon, EggBasketIcon, HenWithChicksIcon, HistoryIcon } from '../components/FarmIcons'
import styles from './TodayRoutePage.module.css'
import { useRouteForDay } from '../hooks/useRouteForDay'
import { useDailySummary } from '../hooks/useDailySummary'
import { saleService } from '../services/saleService'
import { visitService } from '../services/visitService'
import { WEEKDAYS } from '../types'
import type { Client, Sale } from '../types'
import { formatBRL } from '../utils/currency'
import { formatFullDatePT, todayISO, todayWeekday } from '../utils/date'

type ModalState =
  | { step: 'choice'; client: Client; existingSales: Sale[] }
  | { step: 'form'; client: Client; sale: Sale | null }
  | null

interface TodayRoutePageProps {
  onOpenClient: (clientId: string) => void
  onManageClients: () => void
  onOpenHistory: () => void
}

export function TodayRoutePage({ onOpenClient, onManageClients, onOpenHistory }: TodayRoutePageProps) {
  const weekday = todayWeekday()
  const date = todayISO()
  const { routeClients, refresh } = useRouteForDay(weekday, date)
  const { summary, refresh: refreshSummary } = useDailySummary(date)
  const [modal, setModal] = useState<ModalState>(null)
  const [showDailySales, setShowDailySales] = useState(false)
  const [query, setQuery] = useState('')

  const dayLabel = WEEKDAYS.find((day) => day.value === weekday)?.label.replace('-feira', '') ?? ''
  const visitedCount = routeClients.filter((item) => item.visited).length
  const totalClients = routeClients.length
  const progress = totalClients > 0 ? visitedCount / totalClients : 0

  const normalizedQuery = query.trim().toLowerCase()
  const filteredRouteClients = normalizedQuery
    ? routeClients.filter(({ client }) => client.name.toLowerCase().includes(normalizedQuery))
    : routeClients
  const radius = 52
  const circumference = 2 * Math.PI * radius

  function handleOpenClient(client: Client) {
    const existingSales = saleService.getByDate(date).filter((sale) => sale.clientId === client.id)
    setModal({ step: 'choice', client, existingSales })
  }

  function handleSkip(client: Client) {
    visitService.markVisited(client.id, date)
    refresh()
    refreshSummary()
    setModal(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.titleRow}>
          <div className={styles.appIcon}>
            <ChickIcon size={56} />
          </div>
          <button
            type="button"
            className={styles.historyButton}
            onClick={onOpenHistory}
            aria-label="Ver histórico"
          >
            <HistoryIcon size={22} />
          </button>
        </div>

        <p className={styles.eyebrow}>Rota de hoje</p>
        <h1 className={styles.title}>{formatFullDatePT(date)}</h1>

        <div className={styles.heroRow}>
          <div className={styles.progressWrap}>
            <svg viewBox="0 0 120 120" width="172" height="172" className={styles.progressRing}>
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#E5E1D8" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="var(--color-yolk)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className={styles.progressCenter}>
              <p className={styles.progressValue}>
                {visitedCount}/{totalClients}
              </p>
              <p className={styles.progressLabel}>
                clientes
                <br />
                na rota
              </p>
            </div>
          </div>

          <div className={styles.statColumn}>
            <button type="button" className={styles.stat} onClick={() => setShowDailySales(true)}>
              <div>
                <p className={styles.statValue}>{formatBRL(summary.totalSold)}</p>
                <p className={styles.statLabel}>Total vendido</p>
              </div>
              <EggBasketIcon size={22} />
            </button>
            <div className={styles.stat}>
              <div>
                <p className={styles.statValue}>{formatBRL(summary.totalReceived)}</p>
                <p className={styles.statLabel}>Total recebido</p>
              </div>
              <CoinIcon size={22} />
            </div>
            <div className={styles.stat}>
              <div>
                <p className={styles.statValue}>{formatBRL(summary.totalPending)}</p>
                <p className={styles.statLabel}>A receber</p>
              </div>
              <CoopIcon size={22} />
            </div>
          </div>
        </div>
      </div>

      {routeClients.length > 0 && (
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar cliente na rota"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className={styles.searchDivider} />
        </div>
      )}

      <div className={styles.content}>
        {routeClients.length === 0 ? (
          <div className={styles.emptyCard}>
            <p className={styles.emptyText}>
              Nenhum cliente marcado para <strong>{dayLabel}</strong>.
            </p>
            <button type="button" className={styles.manageLink} onClick={onManageClients}>
              Gerenciar clientes →
            </button>
          </div>
        ) : filteredRouteClients.length === 0 ? (
          <p className={styles.emptyText}>Nenhum cliente encontrado.</p>
        ) : (
          filteredRouteClients.map(({ client, visited, noPurchase }) => (
            <ClientRouteItem
              key={client.id}
              client={client}
              visited={visited}
              noPurchase={noPurchase}
              onOpen={() => handleOpenClient(client)}
            />
          ))
        )}

        <div className={styles.familyBadge}>
          <HenWithChicksIcon size={56} />
        </div>
      </div>

      {modal?.step === 'choice' && (
        <SaleChoiceModal
          client={modal.client}
          existingSales={modal.existingSales}
          onClose={() => setModal(null)}
          onRegister={() => setModal({ step: 'form', client: modal.client, sale: null })}
          onEdit={(sale) => setModal({ step: 'form', client: modal.client, sale })}
          onSkip={() => handleSkip(modal.client)}
        />
      )}

      {modal?.step === 'form' && (
        <SaleQuickModal
          client={modal.client}
          sale={modal.sale ?? undefined}
          onClose={() => setModal(null)}
          onSaved={() => {
            refresh()
            refreshSummary()
            setModal(null)
          }}
          onOpenProfile={(clientId) => {
            setModal(null)
            onOpenClient(clientId)
          }}
        />
      )}

      {showDailySales && <DailySalesModal date={date} onClose={() => setShowDailySales(false)} />}
    </div>
  )
}
