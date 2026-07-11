import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import styles from './SaleChoiceModal.module.css'
import type { Client, Sale } from '../types'
import { getSaleUnitLabel } from '../types'
import { formatBRL } from '../utils/currency'

interface SaleChoiceModalProps {
  client: Client
  existingSales: Sale[]
  onClose: () => void
  onRegister: () => void
  onEdit: (sale: Sale) => void
  onSkip: () => void
}

export function SaleChoiceModal({
  client,
  existingSales,
  onClose,
  onRegister,
  onEdit,
  onSkip,
}: SaleChoiceModalProps) {
  const hasSales = existingSales.length > 0

  return (
    <Modal title={client.name} onClose={onClose}>
      <div className={styles.wrapper}>
        {hasSales && (
          <div className={styles.salesList}>
            {existingSales.map((sale) => (
              <button
                key={sale.id}
                type="button"
                className={styles.saleRow}
                onClick={() => onEdit(sale)}
              >
                <span className={styles.saleRowInfo}>
                  {sale.dozens} {getSaleUnitLabel(sale.unit, sale.dozens)} · {formatBRL(sale.amount)} ·{' '}
                  {sale.paid ? 'Pago' : 'Devendo'}
                </span>
                <span className={styles.saleRowEdit}>Editar</span>
              </button>
            ))}
          </div>
        )}

        <Button fullWidth className={styles.registerButton} onClick={onRegister}>
          {hasSales ? 'Registrar nova compra' : 'Registrar compra'}
        </Button>

        {!hasSales && (
          <Button variant="secondary" fullWidth onClick={onSkip}>
            Cliente não quis comprar
          </Button>
        )}
      </div>
    </Modal>
  )
}
