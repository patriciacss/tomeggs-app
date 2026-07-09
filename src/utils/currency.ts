const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Formata um número como moeda brasileira, ex: 45 -> "R$ 45,00". */
export function formatBRL(value: number): string {
  return brlFormatter.format(value)
}

/**
 * Converte texto digitado (aceitando vírgula ou ponto como separador decimal)
 * em número. Retorna 0 para entradas inválidas.
 */
export function parseCurrencyInput(text: string): number {
  const normalized = text.replace(/\./g, '').replace(',', '.').trim()
  const value = Number.parseFloat(normalized)
  return Number.isFinite(value) ? value : 0
}

/**
 * Extrai apenas os dígitos de um texto (usado pelo campo de valor com
 * máscara de centavos, tipo maquininha: os últimos 2 dígitos são sempre
 * os centavos, preenchendo da direita para a esquerda).
 */
export function digitsOnly(text: string): string {
  return text.replace(/\D/g, '').slice(0, 9)
}

/** Converte os dígitos digitados (ex: "4500") no valor em reais (ex: 45). */
export function centsDigitsToAmount(digits: string): number {
  return digits ? Number.parseInt(digits, 10) / 100 : 0
}

/** Formata os dígitos digitados como máscara de moeda, ex: "4500" -> "45,00". */
export function formatCentsDigits(digits: string): string {
  const padded = digits.padStart(3, '0')
  const intPart = padded.slice(0, -2).replace(/^0+(?=\d)/, '')
  const centsPart = padded.slice(-2)
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${withThousands},${centsPart}`
}
