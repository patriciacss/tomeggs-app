import { useCallback, useEffect, useRef, useState } from 'react'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { RouteOrderItem } from '../components/RouteOrderItem'
import { Card } from '../components/ui/Card'
import styles from './DayRoutePage.module.css'
import { clientService } from '../services/clientService'
import { WEEKDAYS } from '../types'
import type { Client, Weekday } from '../types'

interface DayRoutePageProps {
  weekday: Weekday
  onBack: () => void
  onOpenClient: (clientId: string) => void
}

interface DragState {
  id: string
  startIndex: number
  deltaY: number
  startY: number
  slotSize: number
}

function clampIndex(index: number, max: number): number {
  return Math.min(Math.max(index, 0), max)
}

export function DayRoutePage({ weekday, onBack, onOpenClient }: DayRoutePageProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [drag, setDrag] = useState<DragState | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(() => {
    setClients(clientService.getByWeekday(weekday))
  }, [weekday])

  useEffect(() => {
    refresh()
  }, [refresh])

  const dayLabel = WEEKDAYS.find((day) => day.value === weekday)?.label ?? ''

  function handleDragStart(id: string, startY: number) {
    const container = listRef.current
    if (!container) return
    const cards = Array.from(container.querySelectorAll<HTMLElement>('[data-route-item]'))
    if (cards.length < 1) return

    const rects = cards.map((el) => el.getBoundingClientRect())
    const slotSize = rects.length > 1 ? rects[1].top - rects[0].top : rects[0].height + 12
    const startIndex = clients.findIndex((client) => client.id === id)
    if (startIndex === -1) return

    setDrag({ id, startIndex, deltaY: 0, startY, slotSize })
  }

  useEffect(() => {
    if (!drag) return

    function handlePointerMove(event: PointerEvent) {
      setDrag((current) => (current ? { ...current, deltaY: event.clientY - current.startY } : current))
    }

    function handlePointerUp() {
      setDrag((current) => {
        if (!current) return null

        const targetIndex = clampIndex(
          current.startIndex + Math.round(current.deltaY / current.slotSize),
          clients.length - 1,
        )

        if (targetIndex !== current.startIndex) {
          setClients((currentClients) => {
            const reordered = [...currentClients]
            const [moved] = reordered.splice(current.startIndex, 1)
            reordered.splice(targetIndex, 0, moved)
            clientService.reorderForWeekday(weekday, reordered.map((client) => client.id))
            return reordered
          })
        }

        return null
      })
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [drag, clients.length])

  const targetIndex = drag
    ? clampIndex(drag.startIndex + Math.round(drag.deltaY / drag.slotSize), clients.length - 1)
    : null

  return (
    <div>
      <ScreenHeader
        title={dayLabel}
        subtitle={`${clients.length} ${clients.length === 1 ? 'cliente' : 'clientes'} nesta rota`}
        onBack={onBack}
      />
      <div className={styles.list} ref={listRef}>
        {clients.length === 0 && (
          <Card>
            <p className={styles.empty}>Nenhum cliente cadastrado para este dia ainda.</p>
          </Card>
        )}
        {clients.map((client, index) => {
          const isDragging = drag?.id === client.id
          let offset = 0

          if (drag && !isDragging && targetIndex !== null) {
            if (drag.startIndex < targetIndex && index > drag.startIndex && index <= targetIndex) offset = -1
            if (drag.startIndex > targetIndex && index < drag.startIndex && index >= targetIndex) offset = 1
          }

          const displayPosition = isDragging ? (targetIndex ?? index) + 1 : index + offset + 1

          return (
            <RouteOrderItem
              key={client.id}
              client={client}
              position={displayPosition}
              dragging={isDragging}
              style={
                isDragging
                  ? { transform: `translateY(${drag!.deltaY}px)` }
                  : offset !== 0
                    ? { transform: `translateY(${offset * drag!.slotSize}px)` }
                    : undefined
              }
              onDragStart={(clientY) => handleDragStart(client.id, clientY)}
              onOpen={() => onOpenClient(client.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
