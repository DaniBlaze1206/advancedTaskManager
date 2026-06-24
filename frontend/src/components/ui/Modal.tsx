import { useEffect } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >

      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />


      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 id="modal-title" className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        <div className="mt-4">{children}</div>

        {footer && (
          <div className="mt-6 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default Modal