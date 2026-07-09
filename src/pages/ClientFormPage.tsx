import { useState } from 'react'
import type { FormEvent } from 'react'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { Card } from '../components/ui/Card'
import { TextField } from '../components/ui/TextField'
import { ChipToggleGroup } from '../components/ui/ChipToggleGroup'
import { Button } from '../components/ui/Button'
import styles from './ClientFormPage.module.css'
import { useClient } from '../hooks/useClient'
import { clientService } from '../services/clientService'
import { WEEKDAYS } from '../types'
import type { ClientInput, Weekday } from '../types'

interface ClientFormPageProps {
  clientId?: string
  onBack: () => void
  onSaved: (clientId: string) => void
}

export function ClientFormPage({ clientId, onBack, onSaved }: ClientFormPageProps) {
  const isEditing = Boolean(clientId)
  const { client } = useClient(clientId ?? '')

  const [name, setName] = useState(client?.name ?? '')
  const [address, setAddress] = useState(client?.address ?? '')
  const [phone, setPhone] = useState(client?.phone ?? '')
  const [notes, setNotes] = useState(client?.notes ?? '')
  const [deliveryDays, setDeliveryDays] = useState<Weekday[]>(client?.deliveryDays ?? [])
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(!isEditing)

  // Quando o cliente carrega de forma assíncrona (após o primeiro render),
  // preenchemos o formulário uma única vez.
  if (!initialized && client) {
    setName(client.name)
    setAddress(client.address)
    setPhone(client.phone)
    setNotes(client.notes)
    setDeliveryDays(client.deliveryDays)
    setInitialized(true)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (name.trim().length === 0) {
      setError('Informe o nome do cliente.')
      return
    }

    setError(null)

    const input: ClientInput = {
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      deliveryDays,
    }

    if (isEditing && clientId) {
      clientService.update(clientId, input)
      onSaved(clientId)
    } else {
      const created = clientService.add(input)
      onSaved(created.id)
    }
  }

  function handleDelete() {
    if (!clientId) return
    const confirmed = window.confirm('Remover este cliente e todo o seu histórico? Esta ação não pode ser desfeita.')
    if (!confirmed) return
    clientService.remove(clientId)
    onBack()
  }

  return (
    <div>
      <ScreenHeader title={isEditing ? 'Editar cliente' : 'Novo cliente'} onBack={onBack} />
      <div className={styles.content}>
        <Card>
          <form className={styles.form} onSubmit={handleSubmit}>
            <TextField label="Nome" value={name} onChange={setName} placeholder="Ex: Maria" />
            <TextField label="Endereço" value={address} onChange={setAddress} placeholder="Rua, número, bairro" />
            <TextField label="Telefone" value={phone} onChange={setPhone} placeholder="(11) 99999-0000" inputMode="tel" />
            <TextField label="Observações" value={notes} onChange={setNotes} placeholder="Preferências, ponto de referência..." multiline />

            <ChipToggleGroup
              label="Dias de entrega (opcional)"
              options={WEEKDAYS.map((day) => ({ value: day.value, label: day.shortLabel }))}
              values={deliveryDays}
              onChange={setDeliveryDays}
            />

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" fullWidth>
              Salvar cliente
            </Button>

            {isEditing && (
              <Button type="button" variant="danger" fullWidth onClick={handleDelete}>
                Remover cliente
              </Button>
            )}
          </form>
        </Card>
      </div>
    </div>
  )
}
