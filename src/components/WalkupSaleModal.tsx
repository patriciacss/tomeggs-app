import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from './ui/Modal'
import { TextField } from './ui/TextField'
import { SelectField } from './ui/SelectField'
import { SegmentedControl } from './ui/SegmentedControl'
import { Button } from './ui/Button'
import styles from './SaleQuickModal.module.css'
import type { PaymentMethod, ProductType, SaleUnit } from '../types'
import { PRODUCT_TYPES, SALE_UNITS } from '../types'
import { saleService } from '../services/saleService'
import { centsDigitsToAmount, digitsOnly, formatCentsDigits } from '../utils/currency'
import { todayISO } from '../utils/date'

type PaymentChip = PaymentMethod | 'fiado'

const PAYMENT_CHIPS: { value: PaymentChip; label: string }[] = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'Pix' },
  { value: 'cartao', label: 'Cartão' },
  { value: 'fiado', label: 'Fiado' },
]

interface WalkupSaleModalProps {
  onClose: () => void
  onSaved: () => void
}

/** Registra uma venda avulsa, sem vínculo com um cliente cadastrado. */
export function WalkupSaleModal({ onClose, onSaved }: WalkupSaleModalProps) {
  const [dateValue, setDateValue] = useState(todayISO())
  const [customerName, setCustomerName] = useState('')
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
      customerName: customerName.trim() || undefined,
      date: dateValue,
      productType,
      dozens: values.dozens,
      unit,
      amount: values.amount,
      paid,
      paymentMethod,
    })
    onSaved()
  }

  return (
    <Modal title="Venda avulsa" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField label="Data" type="date" value={dateValue} onChange={setDateValue} />

        <TextField
          label="Nome do cliente (opcional)"
          placeholder="Ex: Venda na feira"
          value={customerName}
          onChange={setCustomerName}
        />

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
            Salvar venda
          </Button>
        </div>
      </form>
    </Modal>
  )
}
