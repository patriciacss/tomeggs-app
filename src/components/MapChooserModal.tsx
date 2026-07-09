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

  return (
    <Modal title="Abrir endereço em" onClose={onClose}>
      <div className={styles.options}>
        <a
          className={styles.option}
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          <span className={styles.icon} aria-hidden="true">
            🗺️
          </span>
          Google Maps
        </a>
        <a className={styles.option} href={wazeUrl} target="_blank" rel="noopener noreferrer" onClick={onClose}>
          <span className={styles.icon} aria-hidden="true">
            🚗
          </span>
          Waze
        </a>
      </div>
      <p className={styles.addressPreview}>{address}</p>
    </Modal>
  )
}
