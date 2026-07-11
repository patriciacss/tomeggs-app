import { Modal } from './ui/Modal'
import styles from './DailySalesModal.module.css'
import { saleService } from '../services/saleService'
import { clientService } from '../services/clientService'
import { getSaleUnitLabel } from '../types'
import { formatBRL } from '../utils/currency'
import { formatFullDatePT } from '../utils/date'

interface DailySalesModalProps {
  date: string
  onClose: () => void
}

export function DailySalesModal({ date, onClose }: DailySalesModalProps) {
  const sales = [...saleService.getByDate(date)].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const total = sales.reduce((sum, sale) => sum + sale.amount, 0)

  return (
    <Modal title={`Vendas — ${formatFullDatePT(date)}`} onClose={onClose}>
      <div className={styles.list}>
        {sales.length === 0 && <p className={styles.empty}>Nenhuma venda registrada hoje ainda.</p>}

        {sales.map((sale) => {
          const client = clientService.getById(sale.clientId)
          return (
            <div key={sale.id} className={styles.saleCard}>
              <div className={styles.saleTop}>
                <span className={styles.clientName}>{client?.name ?? 'Cliente removido'}</span>
                <span className={sale.paid ? styles.pillPaid : styles.pillPending}>
                  {sale.paid ? 'Pago' : 'Devendo'}
                </span>
              </div>
              <span className={styles.saleAmount}>
                {sale.dozens} {getSaleUnitLabel(sale.unit, sale.dozens)} · {formatBRL(sale.amount)}
              </span>
            </div>
          )
        })}

        {sales.length > 0 && (
          <div className={styles.total}>
            <span>Total</span>
            <span>{formatBRL(total)}</span>
          </div>
        )}
      </div>
    </Modal>
  )
}
