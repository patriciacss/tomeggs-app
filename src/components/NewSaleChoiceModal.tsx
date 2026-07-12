import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import styles from './NewSaleChoiceModal.module.css'

interface NewSaleChoiceModalProps {
  onClose: () => void
  onPickClient: () => void
  onWalkup: () => void
}

export function NewSaleChoiceModal({ onClose, onPickClient, onWalkup }: NewSaleChoiceModalProps) {
  return (
    <Modal title="Registrar venda" onClose={onClose}>
      <div className={styles.wrapper}>
        <Button fullWidth className={styles.registerButton} onClick={onPickClient}>
          Registrar venda de cliente
        </Button>
        <Button variant="secondary" fullWidth onClick={onWalkup}>
          Registrar venda avulsa
        </Button>
      </div>
    </Modal>
  )
}
