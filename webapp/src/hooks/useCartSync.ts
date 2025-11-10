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
      setItems(cart.items)
    }
  }, [cart?.items, setItems])

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])
}
