import { Modal } from './ui/Modal'
import styles from './MapChooserModal.module.css'

interface MapChooserModalProps {
  address: string
  onClose: () => void
}

export function MapChooserModal({ address, onClose }: MapChooserModalProps) {
  const query = encodeURIComponent(address)

  // Tenta abrir o esquema nativo do app primeiro (o que de fato dispara o
  // app instalado); se depois de um tempinho a página ainda estiver visível
  // (ou seja, o app não abriu), cai pro link universal no navegador.
  function openWithFallback(appUrl: string, webUrl: string) {
    const start = Date.now()
    window.location.href = appUrl

    setTimeout(() => {
      if (!document.hidden && Date.now() - start < 2000) {
        window.location.href = webUrl
      }
    }, 800)
  }

  function openGoogleMaps() {
    openWithFallback(`comgooglemaps://?q=${query}`, `https://www.google.com/maps/search/?api=1&query=${query}`)
    onClose()
  }

  function openWaze() {
    openWithFallback(`waze://?q=${query}&navigate=yes`, `https://waze.com/ul?q=${query}&navigate=yes`)
    onClose()
  }

  return (
    <Modal title="Abrir endereço em" onClose={onClose}>
      <div className={styles.options}>
        <button type="button" className={styles.option} onClick={openGoogleMaps}>
          <span className={styles.icon} aria-hidden="true">
            🗺️
          </span>
          Google Maps
        </button>
        <button type="button" className={styles.option} onClick={openWaze}>
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
