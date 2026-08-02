import { useEffect, useState } from 'react'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { SaleQuickModal } from '../components/SaleQuickModal'
import { SettleDebtModal } from '../components/SettleDebtModal'
import { MapChooserModal } from '../components/MapChooserModal'
import { EggBasketIcon } from '../components/FarmIcons'
import styles from './ClientDetailPage.module.css'
import { useClient } from '../hooks/useClient'
import { useSales } from '../hooks/useSales'
import { clientService } from '../services/clientService'
import { visitService } from '../services/visitService'
import { WEEKDAYS, getSalePaidAmount, getSalePendingAmount, getSaleUnitLabel } from '../types'
import type { Sale, Visit } from '../types'
import { formatBRL } from '../utils/currency'
import { formatDateBR } from '../utils/date'

const PAYMENT_LABELS: Record<string, string> = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão',
}

interface ClientDetailPageProps {
  clientId: string
  onBack: () => void
  onEdit: (clientId: string) => void
}

export function ClientDetailPage({ clientId, onBack, onEdit }: ClientDetailPageProps) {
  const { client } = useClient(clientId)
  const { sales, markSalePaid, refresh: refreshSales } = useSales(clientId)
  const [visits, setVisits] = useState<Visit[]>([])
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showSettleDebt, setShowSettleDebt] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)

  useEffect(() => {
    setVisits(visitService.getByClient(clientId))
  }, [clientId])

  if (!client) {
    return (
      <div>
        <ScreenHeader title="Cliente não encontrado" onBack={onBack} />
        <div className={styles.content}>
          <Card>
            <p>Este cliente pode ter sido removido.</p>
          </Card>
        </div>
      </div>
    )
  }

  const totalFaturado = sales.reduce((sum, sale) => sum + getSalePaidAmount(sale), 0)
  const pendingSales = sales.filter((sale) => !sale.paid)
  const totalDevendo = pendingSales.reduce((sum, sale) => sum + getSalePendingAmount(sale), 0)

  // Visitas em que o cliente foi visitado mas não comprou (sem venda naquela data).
  const declinedDates = visits
    .filter((visit) => !sales.some((sale) => sale.date === visit.date))
    .map((visit) => visit.date)

  type TimelineEntry = { type: 'sale'; date: string; sale: Sale } | { type: 'declined'; date: string }
  const timeline: TimelineEntry[] = [
    ...sales.map((sale): TimelineEntry => ({ type: 'sale', date: sale.date, sale })),
    ...declinedDates.map((date): TimelineEntry => ({ type: 'declined', date })),
  ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

  function handleDelete() {
    const confirmed = window.confirm('Remover este cliente e todo o seu histórico? Esta ação não pode ser desfeita.')
    if (!confirmed) return
    clientService.remove(clientId)
    onBack()
  }

  return (
    <div>
      <ScreenHeader title="" onBack={onBack} />

      <div className={styles.content}>
        <Card className={styles.infoCard}>
          <div className={styles.basketWatermark}>
            <EggBasketIcon size={40} />
          </div>

          <div className={styles.headerRow}>
            <h1 className={styles.name}>{client.name}</h1>
            <button type="button" className={styles.editButton} onClick={() => onEdit(client.id)} aria-label="Editar cliente">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                  d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {client.phone && (
            <p className={styles.infoLine}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" className={styles.infoIcon}>
                <path
                  d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2C10.5 21 3 13.5 3 6a2 2 0 0 1 2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              {client.phone}
            </p>
          )}

          {client.address && (
            <button type="button" className={styles.infoLineButton} onClick={() => setShowMap(true)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" className={styles.infoIcon}>
                <path
                  d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="2" />
              </svg>
              {client.address}
            </button>
          )}

          <div className={styles.dayChips}>
            {client.deliveryDays.map((day) => (
              <span key={day} className={styles.dayChip}>
                {WEEKDAYS.find((option) => option.value === day)?.shortLabel ?? day}
              </span>
            ))}
          </div>
        </Card>

        <div className={styles.statRow}>
          <Card className={styles.statCard}>
            <p className={styles.statValue}>{formatBRL(totalFaturado)}</p>
            <p className={styles.statLabel}>Faturado</p>
          </Card>
          <Card className={styles.statCard}>
            <p className={styles.statValue}>{formatBRL(totalDevendo)}</p>
            <p className={styles.statLabel}>Devendo</p>
          </Card>
          <Card className={styles.statCard}>
            <p className={styles.statValue}>{sales.length}</p>
            <p className={styles.statLabel}>Entregas</p>
          </Card>
        </div>

        <Button fullWidth onClick={() => setShowSaleModal(true)}>
          Registrar venda
        </Button>

        {pendingSales.length > 0 && (
          <Button variant="secondary" fullWidth onClick={() => setShowSettleDebt(true)}>
            Abater dívida
          </Button>
        )}

        <h2 className={styles.sectionTitle}>Histórico</h2>

        {timeline.length === 0 && (
          <Card>
            <p className={styles.empty}>Nenhuma venda ou visita registrada ainda para este cliente.</p>
          </Card>
        )}

        {timeline.map((entry) =>
          entry.type === 'declined' ? (
            <Card key={`declined-${entry.date}`} className={styles.saleCard}>
              <div className={styles.saleTop}>
                <span className={styles.saleDate}>{formatDateBR(entry.date)}</span>
                <span className={styles.pillDeclined}>Não comprou</span>
              </div>
            </Card>
          ) : (
            <Card key={entry.sale.id} className={styles.saleCard}>
              <div className={styles.saleTop}>
                <span className={styles.saleDate}>{formatDateBR(entry.sale.date)}</span>
                <div className={styles.saleTopActions}>
                  {entry.sale.paid ? (
                    <span className={styles.pillPaid}>Pago</span>
                  ) : (
                    <button
                      type="button"
                      className={styles.pillPending}
                      onClick={() => markSalePaid(entry.sale.id, 'dinheiro')}
                    >
                      {getSalePaidAmount(entry.sale) > 0
                        ? `Devendo ${formatBRL(getSalePendingAmount(entry.sale))} · Marcar pago`
                        : 'Devendo · Marcar pago'}
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.saleEditButton}
                    onClick={() => setEditingSale(entry.sale)}
                    aria-label="Editar venda"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path
                        d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <p className={styles.saleAmount}>
                {entry.sale.dozens} {getSaleUnitLabel(entry.sale.unit, entry.sale.dozens)} ·{' '}
                {formatBRL(entry.sale.amount)}
              </p>
              {entry.sale.paid && entry.sale.paymentMethod && (
                <p className={styles.salePayment}>{PAYMENT_LABELS[entry.sale.paymentMethod]}</p>
              )}
              {!entry.sale.paid && getSalePaidAmount(entry.sale) > 0 && (
                <p className={styles.salePayment}>Já pago: {formatBRL(getSalePaidAmount(entry.sale))}</p>
              )}
            </Card>
          ),
        )}

        <button type="button" className={styles.deleteButton} onClick={handleDelete}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Excluir cliente
        </button>
      </div>

      {showSaleModal && (
        <SaleQuickModal
          client={client}
          markVisitedOnSave={false}
          onClose={() => setShowSaleModal(false)}
          onSaved={() => {
            refreshSales()
            setShowSaleModal(false)
          }}
        />
      )}

      {editingSale && (
        <SaleQuickModal
          client={client}
          sale={editingSale}
          onClose={() => setEditingSale(null)}
          onSaved={() => {
            refreshSales()
            setEditingSale(null)
          }}
        />
      )}

      {showMap && client.address && (
        <MapChooserModal address={client.address} onClose={() => setShowMap(false)} />
      )}

      {showSettleDebt && (
        <SettleDebtModal
          client={client}
          pendingSales={pendingSales}
          onClose={() => setShowSettleDebt(false)}
          onSettled={() => {
            refreshSales()
            setShowSettleDebt(false)
          }}
        />
      )}
    </div>
  )
}
