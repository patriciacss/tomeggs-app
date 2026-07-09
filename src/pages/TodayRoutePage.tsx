import { useState } from 'react'
import { ClientRouteItem } from '../components/ClientRouteItem'
import { SaleQuickModal } from '../components/SaleQuickModal'
import { ChickIcon, CoinIcon, CoopIcon, EggBasketIcon, HenWithChicksIcon } from '../components/FarmIcons'
import styles from './TodayRoutePage.module.css'
import { useRouteForDay } from '../hooks/useRouteForDay'
import { useDailySummary } from '../hooks/useDailySummary'
import { WEEKDAYS } from '../types'
import { formatBRL } from '../utils/currency'
import { formatFullDatePT, todayISO, todayWeekday } from '../utils/date'

interface TodayRoutePageProps {
  onOpenClient: (clientId: string) => void
  onManageClients: () => void
}

export function TodayRoutePage({ onOpenClient, onManageClients }: TodayRoutePageProps) {
  const weekday = todayWeekday()
  const date = todayISO()
  const { routeClients, refresh } = useRouteForDay(weekday, date)
  const { summary, refresh: refreshSummary } = useDailySummary(date)
  const [saleClientId, setSaleClientId] = useState<string | null>(null)
  const saleClient = routeClients.find((item) => item.client.id === saleClientId)?.client

  const dayLabel = WEEKDAYS.find((day) => day.value === weekday)?.label.replace('-feira', '') ?? ''
  const visitedCount = routeClients.filter((item) => item.visited).length
  const totalClients = routeClients.length
  const progress = totalClients > 0 ? visitedCount / totalClients : 0
  const radius = 52
  const circumference = 2 * Math.PI * radius

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.titleRow}>
          <div className={styles.appIcon}>
            <ChickIcon size={56} />
          </div>
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
            <div className={styles.stat}>
              <div>
                <p className={styles.statValue}>{formatBRL(summary.totalSold)}</p>
                <p className={styles.statLabel}>Total vendido</p>
              </div>
              <EggBasketIcon size={22} />
            </div>
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
        ) : (
          routeClients.map(({ client, visited }) => (
            <ClientRouteItem
              key={client.id}
              client={client}
              visited={visited}
              onOpen={() => setSaleClientId(client.id)}
            />
          ))
        )}

        <div className={styles.familyBadge}>
          <HenWithChicksIcon size={56} />
        </div>
      </div>

      {saleClient && (
        <SaleQuickModal
          client={saleClient}
          onClose={() => setSaleClientId(null)}
          onSaved={() => {
            refresh()
            refreshSummary()
            setSaleClientId(null)
          }}
          onOpenProfile={(clientId) => {
            setSaleClientId(null)
            onOpenClient(clientId)
          }}
        />
      )}
    </div>
  )
}
