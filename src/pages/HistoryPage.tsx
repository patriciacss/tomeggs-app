import { useMemo, useState } from 'react'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { Card } from '../components/ui/Card'
import { EggBasketIcon, CoinIcon, CoopIcon } from '../components/FarmIcons'
import styles from './HistoryPage.module.css'
import { saleService } from '../services/saleService'
import { clientService } from '../services/clientService'
import { getSalePaidAmount, getSalePendingAmount, getSaleUnitLabel } from '../types'
import { formatBRL } from '../utils/currency'
import { formatFullDatePT, todayISO } from '../utils/date'

interface HistoryPageProps {
  onBack: () => void
}

export function HistoryPage({ onBack }: HistoryPageProps) {
  const [selectedDate, setSelectedDate] = useState(todayISO())

  const allSales = saleService.getAll()

  const overall = useMemo(() => {
    let totalSold = 0
    let totalReceived = 0
    let totalPending = 0
    for (const sale of allSales) {
      totalSold += sale.amount
      totalReceived += getSalePaidAmount(sale)
      totalPending += getSalePendingAmount(sale)
    }
    return { totalSold, totalReceived, totalPending }
  }, [allSales])

  const clientsCount = clientService.getAll().length

  const salesForDate = useMemo(
    () =>
      allSales
        .filter((sale) => sale.date === selectedDate)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [allSales, selectedDate],
  )

  const dateSummary = useMemo(() => {
    let totalSold = 0
    let totalReceived = 0
    let totalPending = 0
    for (const sale of salesForDate) {
      totalSold += sale.amount
      totalReceived += getSalePaidAmount(sale)
      totalPending += getSalePendingAmount(sale)
    }
    return { totalSold, totalReceived, totalPending }
  }, [salesForDate])

  return (
    <div>
      <ScreenHeader title="Histórico" subtitle="Visão geral de todas as vendas" onBack={onBack} />
      <div className={styles.content}>
        <Card>
          <h2 className={styles.cardTitle}>Resumo geral</h2>
          <div className={styles.statGrid}>
            <div className={styles.stat}>
              <EggBasketIcon size={22} />
              <div>
                <p className={styles.statValue}>{formatBRL(overall.totalSold)}</p>
                <p className={styles.statLabel}>Total vendido</p>
              </div>
            </div>
            <div className={styles.stat}>
              <CoinIcon size={22} />
              <div>
                <p className={styles.statValue}>{formatBRL(overall.totalReceived)}</p>
                <p className={styles.statLabel}>Total recebido</p>
              </div>
            </div>
            <div className={styles.stat}>
              <CoopIcon size={22} />
              <div>
                <p className={styles.statValue}>{formatBRL(overall.totalPending)}</p>
                <p className={styles.statLabel}>A receber</p>
              </div>
            </div>
          </div>
          <p className={styles.meta}>
            {allSales.length} venda(s) registrada(s) · {clientsCount} cliente(s) cadastrado(s)
          </p>
        </Card>

        <Card>
          <h2 className={styles.cardTitle}>Consultar por data</h2>
          <div className={styles.dateField}>
            <label htmlFor="history-date" className={styles.dateLabel}>
              Data
            </label>
            <input
              id="history-date"
              type="date"
              className={styles.dateInput}
              value={selectedDate}
              max={todayISO()}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>

          {salesForDate.length > 0 && (
            <div className={styles.statGrid}>
              <div className={styles.stat}>
                <EggBasketIcon size={22} />
                <div>
                  <p className={styles.statValue}>{formatBRL(dateSummary.totalSold)}</p>
                  <p className={styles.statLabel}>Total vendido</p>
                </div>
              </div>
              <div className={styles.stat}>
                <CoinIcon size={22} />
                <div>
                  <p className={styles.statValue}>{formatBRL(dateSummary.totalReceived)}</p>
                  <p className={styles.statLabel}>Total recebido</p>
                </div>
              </div>
              <div className={styles.stat}>
                <CoopIcon size={22} />
                <div>
                  <p className={styles.statValue}>{formatBRL(dateSummary.totalPending)}</p>
                  <p className={styles.statLabel}>A receber</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className={styles.cardTitle}>Vendas do dia</h2>
          <div className={styles.list}>
            {salesForDate.length === 0 && (
              <p className={styles.empty}>Nenhuma venda registrada em {formatFullDatePT(selectedDate)}.</p>
            )}

            {salesForDate.map((sale) => {
              const client = sale.clientId ? clientService.getById(sale.clientId) : undefined
              const name = client?.name ?? sale.customerName ?? (sale.clientId ? 'Cliente removido' : 'Venda avulsa')
              return (
                <div key={sale.id} className={styles.saleCard}>
                  <div className={styles.saleTop}>
                    <span className={styles.clientName}>{name}</span>
                    <span className={sale.paid ? styles.pillPaid : styles.pillPending}>
                      {sale.paid ? 'Pago' : getSalePaidAmount(sale) > 0 ? 'Parcial' : 'Devendo'}
                    </span>
                  </div>
                  <span className={styles.saleAmount}>
                    {sale.dozens} {getSaleUnitLabel(sale.unit, sale.dozens)} · {formatBRL(sale.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
