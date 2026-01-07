import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface MenuStore {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
}

export const useMenuStore = create<MenuStore>()(
  devtools(
    persist(
      (set) => ({
        isOpen: false,
        openMenu: () => set({ isOpen: true }),
        closeMenu: () => set({ isOpen: false }),
        toggleMenu: () =>
          set((state) => ({
            isOpen: !state.isOpen,
          })),
      }),
      {
        name: 'menu-storage',
        partialize: (state) => ({
          isOpen: state.isOpen,
        }),
      },
    ),
  ),
)
