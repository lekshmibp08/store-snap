import type React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                  
      <div
        className="rounded-lg p-6 w-full max-w-md mx-4 shadow-lg transition-all duration-300"
        style={{
          backgroundColor: "var(--card-color)",
          color: "var(--text-color)",
          border: "1px solid var(--text-color)",
        }}      
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-color)]">{title}</h2>
          <button onClick={onClose}
            className="text-[var(--text-color)] hover:text-red-500 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
