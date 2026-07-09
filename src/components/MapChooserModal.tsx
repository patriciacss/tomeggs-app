import { Modal } from './ui/Modal'
import styles from './MapChooserModal.module.css'

interface MapChooserModalProps {
  address: string
  onClose: () => void
}

export function MapChooserModal({ address, onClose }: MapChooserModalProps) {
  const query = encodeURIComponent(address)
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`
  const wazeUrl = `https://waze.com/ul?q=${query}&navigate=yes`

  function open(url: string) {
    // Navega na mesma janela (sem target="_blank") para o celular conseguir
    // interceptar o link universal e abrir o app nativo (Waze/Maps) — em
    // modo PWA "standalone" não existe aba nova pra abrir, então
    // target="_blank" simplesmente não fazia nada.
    window.location.href = url
    onClose()
  }

  return (
    <Modal title="Abrir endereço em" onClose={onClose}>
      <div className={styles.options}>
        <button type="button" className={styles.option} onClick={() => open(googleMapsUrl)}>
          <span className={styles.icon} aria-hidden="true">
            🗺️
          </span>
          Google Maps
        </button>
        <button type="button" className={styles.option} onClick={() => open(wazeUrl)}>
          <span className={styles.icon} aria-hidden="true">
            🚗
          </span>
          Waze
        </button>
      </div>
      <p className={styles.addressPreview}>{address}</p>
    </Modal>
  )
}
