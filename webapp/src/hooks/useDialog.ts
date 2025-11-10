import { useState } from 'react'

export const useDialog = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  }
}
