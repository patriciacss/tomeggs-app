import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from './ui/Modal'
import { TextField } from './ui/TextField'
import { Button } from './ui/Button'
import styles from './SettleDebtModal.module.css'
import type { Client, PaymentMethod, Sale } from '../types'
import { getSalePendingAmount } from '../types'
import { saleService } from '../services/saleService'
import { centsDigitsToAmount, digitsOnly, formatBRL, formatCentsDigits } from '../utils/currency'

const PAYMENT_CHIPS: { value: PaymentMethod; label: string }[] = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'Pix' },
  { value: 'cartao', label: 'Cartão' },
]

interface SettleDebtModalProps {
  client: Client
  pendingSales: Sale[]
  onClose: () => void
  onSettled: () => void
}

/** Ordena da dívida mais antiga para a mais recente (data, depois criação). */
function oldestFirst(sales: Sale[]): Sale[] {
  return [...sales].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1
    return a.createdAt < b.createdAt ? -1 : 1
  })
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/** Permite abater um valor da dívida do cliente, aplicando automaticamente das vendas mais antigas às mais recentes. */
export function SettleDebtModal({ client, pendingSales, onClose, onSettled }: SettleDebtModalProps) {
  const [amountDigits, setAmountDigits] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dinheiro')
  const [error, setError] = useState<string | null>(null)

  const totalDevendo = pendingSales.reduce((sum, sale) => sum + getSalePendingAmount(sale), 0)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const amount = centsDigitsToAmount(amountDigits)

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Informe o valor a abater.')
      return
    }
    if (amount > totalDevendo + 0.001) {
      setError(`O valor não pode ser maior que a dívida total (${formatBRL(totalDevendo)}).`)
      return
    }
    setError(null)

    let remaining = round2(amount)

    for (const sale of oldestFirst(pendingSales)) {
      if (remaining <= 0) break

      const pending = getSalePendingAmount(sale)
      const portion = Math.min(remaining, pending)
      saleService.applyPayment(sale.id, portion, paymentMethod)
      remaining = round2(remaining - portion)
    }

    onSettled()
  }

  return (
    <Modal title={`Abater dívida — ${client.name}`} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.hint}>
          Dívida total: <strong>{formatBRL(totalDevendo)}</strong>. O valor informado é abatido automaticamente
          das vendas mais antigas para as mais recentes.
        </p>

        <TextField
          label="Valor a abater (R$)"
          inputMode="numeric"
          placeholder="0,00"
          value={amountDigits ? formatCentsDigits(amountDigits) : ''}
          onChange={(value) => setAmountDigits(digitsOnly(value))}
        />

        <div className={styles.chipField}>
          <span className={styles.chipLabel}>Forma de pagamento</span>
          <div className={styles.chipGrid}>
            {PAYMENT_CHIPS.map((chip) => (
              <button
                key={chip.value}
                type="button"
                aria-pressed={paymentMethod === chip.value}
                className={`${styles.chip} ${paymentMethod === chip.value ? styles.chipSelected : ''}`}
                onClick={() => setPaymentMethod(chip.value)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <Button type="submit" fullWidth className={styles.confirmButton}>
          Abater
        </Button>
      </form>
    </Modal>
  )
}
