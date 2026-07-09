import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from './ui/Modal'
import { TextField } from './ui/TextField'
import { SelectField } from './ui/SelectField'
import { SegmentedControl } from './ui/SegmentedControl'
import { Button } from './ui/Button'
import styles from './SaleQuickModal.module.css'
import type { Client, PaymentMethod, ProductType, SaleUnit } from '../types'
import { PRODUCT_TYPES, SALE_UNITS } from '../types'
import { saleService } from '../services/saleService'
import { visitService } from '../services/visitService'
import { centsDigitsToAmount, digitsOnly, formatCentsDigits } from '../utils/currency'
import { todayISO } from '../utils/date'

type PaymentChip = PaymentMethod | 'fiado'

const PAYMENT_CHIPS: { value: PaymentChip; label: string }[] = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'Pix' },
  { value: 'cartao', label: 'Cartão' },
  { value: 'fiado', label: 'Fiado' },
]

interface SaleQuickModalProps {
  client: Client
  onClose: () => void
  onSaved: () => void
  onOpenProfile?: (clientId: string) => void
  /** Marca o cliente como entregue na rota de hoje ao salvar (padrão: true). */
  markVisitedOnSave?: boolean
}

export function SaleQuickModal({
  client,
  onClose,
  onSaved,
  onOpenProfile,
  markVisitedOnSave = true,
}: SaleQuickModalProps) {
  const [productType, setProductType] = useState<ProductType>('jumbo-branco')
  const [unit, setUnit] = useState<SaleUnit>('cartela')
  const [dozensText, setDozensText] = useState('')
  const [amountDigits, setAmountDigits] = useState('')
  const [paymentChip, setPaymentChip] = useState<PaymentChip>('dinheiro')
  const [error, setError] = useState<string | null>(null)

  function readAmounts(): { dozens: number; amount: number } | null {
    const dozens = Number.parseFloat(dozensText.replace(',', '.'))
    const amount = centsDigitsToAmount(amountDigits)

    if (!Number.isFinite(dozens) || dozens <= 0) {
      setError('Informe a quantidade.')
      return null
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Informe o valor total da venda.')
      return null
    }
    setError(null)
    return { dozens, amount }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const values = readAmounts()
    if (!values) return

    const paid = paymentChip !== 'fiado'
    const paymentMethod: PaymentMethod | undefined = paid ? (paymentChip as PaymentMethod) : undefined

    saleService.add({
      clientId: client.id,
      date: todayISO(),
      productType,
      dozens: values.dozens,
      unit,
      amount: values.amount,
      paid,
      paymentMethod,
    })
    if (markVisitedOnSave) {
      visitService.markVisited(client.id, todayISO())
    }
    onSaved()
  }

  return (
    <Modal title={client.name} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <SelectField
          label="Tipo"
          options={PRODUCT_TYPES}
          value={productType}
          onChange={(value) => setProductType(value as ProductType)}
        />

        <SegmentedControl
          label="Unidade"
          options={SALE_UNITS.map((option) => ({ value: option.value, label: option.label }))}
          value={unit}
          onChange={setUnit}
        />

        <div className={styles.row}>
          <TextField
            label="Quantidade"
            inputMode="decimal"
            placeholder="Ex: 3"
            value={dozensText}
            onChange={setDozensText}
          />
          <TextField
            label="Valor total (R$)"
            inputMode="numeric"
            placeholder="0,00"
            value={amountDigits ? formatCentsDigits(amountDigits) : ''}
            onChange={(value) => setAmountDigits(digitsOnly(value))}
          />
        </div>

        <div className={styles.chipField}>
          <span className={styles.chipLabel}>Forma de pagamento</span>
          <div className={styles.chipGrid}>
            {PAYMENT_CHIPS.map((chip) => (
              <button
                key={chip.value}
                type="button"
                aria-pressed={paymentChip === chip.value}
                className={`${styles.chip} ${paymentChip === chip.value ? styles.chipSelected : ''}`}
                onClick={() => setPaymentChip(chip.value)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button type="submit" fullWidth className={styles.deliverButton}>
            {markVisitedOnSave ? 'Marcar entregue' : 'Salvar venda'}
          </Button>
        </div>

        {onOpenProfile && (
          <button type="button" className={styles.profileLink} onClick={() => onOpenProfile(client.id)}>
            Ver perfil e histórico →
          </button>
        )}
      </form>
    </Modal>
  )
}
