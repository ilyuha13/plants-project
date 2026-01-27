import { useEffect } from 'react'

import { useMe } from '../lib/ctx'
import { trpc } from '../lib/trpc'
import { useCartStore } from '../stores/cartStore'

export function useCartSync() {
  const me = useMe()
  const setItems = useCartStore((state) => state.setItems)
  const setLoading = useCartStore((state) => state.setLoading)

  const { data: cart, isLoading } = trpc.getCart.useQuery(
    { userId: me?.id || '' },
    {
      enabled: !!me?.id,
      refetchOnWindowFocus: true,
    },
  )

  useEffect(() => {
    if (cart?.items) {
      const items = cart.items.map((item) => {
        const { plantInstance, ...restItem } = item
        const { price, ...restPlantInstance } = plantInstance
        const newPrice = String(price)
        const newPlantInstance = {
          price: newPrice,
          ...restPlantInstance,
        }
        return {
          plantInstance: newPlantInstance,
          ...restItem,
        }
      })
      setItems(items)
    }
  }, [cart?.items, setItems])

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])
}
