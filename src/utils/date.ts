import type { Weekday } from '../types'

/** Retorna a data de hoje no formato YYYY-MM-DD (baseado no horário local). */
export function todayISO(): string {
  return toISODate(new Date())
}

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const WEEKDAY_BY_INDEX: Weekday[] = [
  'domingo',
  'segunda',
  'terca',
  'quarta',
  'quinta',
  'sexta',
  'sabado',
]

/** Converte uma data (YYYY-MM-DD) no dia da semana correspondente. */
export function weekdayOf(dateISO: string): Weekday {
  const [year, month, day] = dateISO.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return WEEKDAY_BY_INDEX[date.getDay()]
}

export function todayWeekday(): Weekday {
  return WEEKDAY_BY_INDEX[new Date().getDay()]
}

/** Formata uma data YYYY-MM-DD para o padrão brasileiro DD/MM/YYYY. */
export function formatDateBR(dateISO: string): string {
  const [year, month, day] = dateISO.split('-')
  return `${day}/${month}/${year}`
}

/**
 * Formata uma data YYYY-MM-DD por extenso, com cada palavra capitalizada.
 * Ex: "2026-07-09" -> "Quinta-Feira, 09 De Julho"
 */
export function formatFullDatePT(dateISO: string): string {
  const [year, month, day] = dateISO.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const raw = date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
  return raw.replace(/(^|[\s-])\p{L}/gu, (match) => match.toUpperCase())
}

/** Ordena datas ISO da mais recente para a mais antiga. */
export function sortDatesDesc(dates: string[]): string[] {
  return [...dates].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
}
