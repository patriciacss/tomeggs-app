// Dias da semana usados tanto para rotas de entrega quanto para navegação.
export type Weekday =
  | 'segunda'
  | 'terca'
  | 'quarta'
  | 'quinta'
  | 'sexta'
  | 'sabado'
  | 'domingo'

export interface WeekdayOption {
  value: Weekday
  label: string
  shortLabel: string
}

export const WEEKDAYS: WeekdayOption[] = [
  { value: 'segunda', label: 'Segunda-feira', shortLabel: 'Seg' },
  { value: 'terca', label: 'Terça-feira', shortLabel: 'Ter' },
  { value: 'quarta', label: 'Quarta-feira', shortLabel: 'Qua' },
  { value: 'quinta', label: 'Quinta-feira', shortLabel: 'Qui' },
  { value: 'sexta', label: 'Sexta-feira', shortLabel: 'Sex' },
  { value: 'sabado', label: 'Sábado', shortLabel: 'Sáb' },
  { value: 'domingo', label: 'Domingo', shortLabel: 'Dom' },
]

// Forma de pagamento escolhida quando o cliente paga na hora.
export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao'

// Unidade de venda: cartela (30 ovos) ou caixa (fechada, várias cartelas).
export type SaleUnit = 'cartela' | 'caixa'

export interface SaleUnitOption {
  value: SaleUnit
  label: string
  labelPlural: string
}

export const SALE_UNITS: SaleUnitOption[] = [
  { value: 'cartela', label: 'Cartela', labelPlural: 'Cartelas' },
  { value: 'caixa', label: 'Caixa', labelPlural: 'Caixas' },
]

export function getSaleUnitLabel(unit: SaleUnit | undefined, quantity: number): string {
  const option = SALE_UNITS.find((item) => item.value === unit) ?? SALE_UNITS[0]
  return quantity === 1 ? option.label : option.labelPlural
}

// Tipo de ovo vendido.
export type ProductType = 'jumbo-branco' | 'jumbo-vermelho' | 'extra-branco' | 'extra-vermelho' | 'grande-branco' | 'grande-vermelho' | 'medio' | 'embalado-branco' | 'embalado-vermelho' | 'pvc-grande-branco' | 'pvc-grande-vermelho' | 'pvc-extra-branco' | 'pvc-extra-vermelho' | 'caipira' | 'codorna' | 'codorna-pacote'

export interface ProductTypeOption {
  value: ProductType
  label: string
}

export const PRODUCT_TYPES: ProductTypeOption[] = [
  { value: 'jumbo-branco', label: 'Jumbo Branco' },
  { value: 'jumbo-vermelho', label: 'Jumbo Vermelho' },
  { value: 'extra-branco', label: 'Extra Branco' },
  { value: 'extra-vermelho', label: 'Extra Vermelho' },
  { value: 'grande-branco', label: 'Grande Branco' },
  { value: 'grande-vermelho', label: 'Grande Vermelho' },
  { value: 'medio', label: 'Médio' },
  { value: 'embalado-branco', label: 'Embalado Branco' },
  { value: 'embalado-vermelho', label: 'Embalado Vermelho' },
  { value: 'pvc-grande-branco', label: 'PVC Grande Branco' },
  { value: 'pvc-grande-vermelho', label: 'PVC Grande Vermelho' },
  { value: 'pvc-extra-branco', label: 'PVC Extra Branco' },
  { value: 'pvc-extra-vermelho', label: 'PVC Extra Vermelho' },
  { value: 'caipira', label: 'Caipira' },
  { value: 'codorna', label: 'Codorna' },
  { value: 'codorna-pacote', label: 'Codorna Pacote' },
]

export function getProductTypeLabel(type: ProductType | undefined): string {
  const found = PRODUCT_TYPES.find((option) => option.value === type)
  return found?.label ?? 'Ovos brancos'
}

export interface Client {
  id: string
  name: string
  address: string
  phone: string
  notes: string
  deliveryDays: Weekday[]
  createdAt: string
  updatedAt?: string
  deleted?: boolean
}

export type ClientInput = Omit<Client, 'id' | 'createdAt'>

// Uma venda registrada para um cliente em uma data específica.
// Quando não paga, é considerada "fiado" (pendente) e paymentMethod fica undefined.
export interface Sale {
  id: string
  // Ausente quando é uma venda avulsa (sem cliente cadastrado) — nesse caso
  // customerName guarda o nome informado na hora, se houver.
  clientId?: string
  customerName?: string
  date: string // formato YYYY-MM-DD
  productType: ProductType
  dozens: number
  unit: SaleUnit
  amount: number
  paid: boolean
  paymentMethod?: PaymentMethod
  createdAt: string
  updatedAt?: string
  deleted?: boolean
}

export type SaleInput = {
  clientId?: string
  customerName?: string
  date: string
  productType: ProductType
  dozens: number
  unit: SaleUnit
  amount: number
  paid: boolean
  paymentMethod?: PaymentMethod
}

// Registro de que um cliente foi visitado em uma determinada data,
// independente de ter havido venda ou não.
export interface Visit {
  id: string
  clientId: string
  date: string // formato YYYY-MM-DD
  visitedAt: string
  updatedAt?: string
  deleted?: boolean
}
