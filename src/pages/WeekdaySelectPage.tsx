import { ScreenHeader } from '../components/ui/ScreenHeader'
import { Card } from '../components/ui/Card'
import styles from './WeekdaySelectPage.module.css'
import { WEEKDAYS } from '../types'
import type { Weekday } from '../types'
import { clientService } from '../services/clientService'
import { todayWeekday } from '../utils/date'

interface WeekdaySelectPageProps {
  onSelect: (weekday: Weekday) => void
}

export function WeekdaySelectPage({ onSelect }: WeekdaySelectPageProps) {
  const today = todayWeekday()

  return (
    <div>
      <ScreenHeader
        title="Rotas de Entrega"
        subtitle="Escolha o dia para ver os clientes"
        action={
          <svg viewBox="0 0 200 200" width="44" height="44" aria-hidden="true">
            <path
              d="M60,112 C35,95 18,65 14,32 C28,48 34,70 44,88"
              fill="#FFFDF3"
              stroke="#4A3325"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M64,120 C42,108 22,88 12,56 C28,66 40,82 52,100"
              fill="#F3D19E"
              stroke="#4A3325"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M70,128 C50,122 30,110 18,84 C34,90 48,100 58,114"
              fill="#FFFDF3"
              stroke="#4A3325"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <ellipse cx="95" cy="128" rx="52" ry="42" fill="#FFFDF3" stroke="#4A3325" strokeWidth="5" />
            <path
              d="M72,110 C90,102 112,110 118,132 C104,128 86,130 74,140 C68,130 68,118 72,110 Z"
              fill="#F3D19E"
              stroke="#4A3325"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="152" cy="80" r="27" fill="#FFFDF3" stroke="#4A3325" strokeWidth="5" />
            <path
              d="M130,58 Q134,38 141,56 Q147,34 154,56 Q160,36 167,56 Q168,64 160,64 L136,64 Q129,64 130,58 Z"
              fill="#E4593A"
              stroke="#4A3325"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M168,96 C166,106 174,112 178,104 C182,112 176,120 168,116 C160,112 162,100 168,96 Z"
              fill="#E4593A"
              stroke="#4A3325"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <polygon points="177,76 198,70 198,86" fill="#F3A76A" stroke="#4A3325" strokeWidth="3.5" strokeLinejoin="round" />
            <circle cx="160" cy="72" r="3.5" fill="#4A3325" />
            <line x1="82" y1="168" x2="80" y2="196" stroke="#F3A76A" strokeWidth="6" strokeLinecap="round" />
            <line x1="110" y1="168" x2="112" y2="196" stroke="#F3A76A" strokeWidth="6" strokeLinecap="round" />
            <path d="M80,196 L68,200 M80,196 L80,201 M80,196 L92,200" stroke="#4A3325" strokeWidth="4" strokeLinecap="round" />
            <path d="M112,196 L100,200 M112,196 L112,201 M112,196 L124,200" stroke="#4A3325" strokeWidth="4" strokeLinecap="round" />
          </svg>
        }
      />
      <div className={styles.list}>
        {WEEKDAYS.map((day) => {
          const count = clientService.getByWeekday(day.value).length
          const isToday = day.value === today
          return (
            <Card
              key={day.value}
              className={styles.dayCard}
              onClick={() => onSelect(day.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect(day.value)
              }}
            >
              <div>
                <p className={styles.dayName}>
                  {day.label}
                  {isToday && <span className={styles.todayBadge}>Hoje</span>}
                </p>
                <p className={styles.dayCount}>
                  {count} {count === 1 ? 'cliente' : 'clientes'}
                </p>
              </div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
