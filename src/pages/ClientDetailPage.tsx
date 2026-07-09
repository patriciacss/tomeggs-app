import { useState } from 'react'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { SaleQuickModal } from '../components/SaleQuickModal'
import { MapChooserModal } from '../components/MapChooserModal'
import { EggBasketIcon } from '../components/FarmIcons'
import styles from './ClientDetailPage.module.css'
import { useClient } from '../hooks/useClient'
import { useSales } from '../hooks/useSales'
import { clientService } from '../services/clientService'
import { WEEKDAYS, getSaleUnitLabel } from '../types'
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
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [showMap, setShowMap] = useState(false)

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

  const totalFaturado = sales.filter((sale) => sale.paid).reduce((sum, sale) => sum + sale.amount, 0)
  const totalDevendo = sales.filter((sale) => !sale.paid).reduce((sum, sale) => sum + sale.amount, 0)

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

        <h2 className={styles.sectionTitle}>Histórico</h2>

        {sales.length === 0 && (
          <Card>
            <p className={styles.empty}>Nenhuma venda registrada ainda para este cliente.</p>
          </Card>
        )}

        {sales.map((sale) => (
          <Card key={sale.id} className={styles.saleCard}>
            <div className={styles.saleTop}>
              <span className={styles.saleDate}>{formatDateBR(sale.date)}</span>
              {sale.paid ? (
                <span className={styles.pillPaid}>Pago</span>
              ) : (
                <button
                  type="button"
                  className={styles.pillPending}
                  onClick={() => markSalePaid(sale.id, 'dinheiro')}
                >
                  Devendo · Marcar pago
                </button>
              )}
            </div>
            <p className={styles.saleAmount}>
              {sale.dozens} {getSaleUnitLabel(sale.unit, sale.dozens)} · {formatBRL(sale.amount)}
            </p>
            {sale.paid && sale.paymentMethod && (
              <p className={styles.salePayment}>{PAYMENT_LABELS[sale.paymentMethod]}</p>
            )}
          </Card>
        ))}

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

      {showMap && client.address && (
        <MapChooserModal address={client.address} onClose={() => setShowMap(false)} />
      )}
    </div>
  )
}
