import styles from './BottomNav.module.css'
import type { Tab } from '../types/navigation'

interface NavItem {
  tab: Tab
  label: string
  icon: JSX.Element
}

const ITEMS: NavItem[] = [
  {
    tab: 'rota',
    label: 'Hoje',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="4" y="5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="2" />
        <path d="M4 9.5h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    tab: 'resumo',
    label: 'Rotas',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path
          d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    tab: 'clientes',
    label: 'Clientes',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
        <path
          d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    tab: 'backup',
    label: 'Backup',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path
          d="M12 4v10m0 0l-4-4m4 4l4-4M5 18h14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

interface BottomNavProps {
  activeTab: Tab
  onSelect: (tab: Tab) => void
  onAddSale: () => void
}

export function BottomNav({ activeTab, onSelect, onAddSale }: BottomNavProps) {
  const [first, second, ...rest] = ITEMS
  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      {[first, second].map((item) => (
        <button
          key={item.tab}
          type="button"
          className={`${styles.item} ${activeTab === item.tab ? styles.active : ''}`}
          onClick={() => onSelect(item.tab)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}

      <div className={styles.fabSlot}>
        <button type="button" className={styles.fab} onClick={onAddSale} aria-label="Registrar venda">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {rest.map((item) => (
        <button
          key={item.tab}
          type="button"
          className={`${styles.item} ${activeTab === item.tab ? styles.active : ''}`}
          onClick={() => onSelect(item.tab)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
