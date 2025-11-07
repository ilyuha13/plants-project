import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type TCartItem = {
  id: string
  plantInstanceId: string
  plantInstance: {
    Id: string
    price: string
    plant: {
      plantId: string
      name: string
      imagesUrl: string[]
    }
  }
}

type CartStore = {
  items: TCartItem[]
  isOpen: boolean
  isLoading: boolean

  setItems: (items: TCartItem[]) => void
  addItem: (item: TCartItem) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  setLoading: (loading: boolean) => void
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        isOpen: false,
        isLoading: false,

        setItems: (items) => set({ items }),

        addItem: (item) =>
          set((state) => ({
            items: [...state.items, item],
            isOpen: true,
          })),

        removeItem: (itemId) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          })),
        clearCart: () => set({ items: [] }),
        openCart: () => set({ isOpen: true }),
        closeCart: () => set({ isOpen: false }),
        setLoading: (loading) => set({ isLoading: loading }),
      }),
      {
        name: 'cart-storage',
        partialize: (state) => ({
          items: state.items,
        }),
      },
    ),
    {
      name: 'CartStore',
    },
  ),
)
