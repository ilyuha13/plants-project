import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { getSignInRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import { useCartStore } from '../../stores/cartStore'
export const SignOutPage = () => {
  const clearCart = useCartStore((state) => state.clearCart)
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils()
  useEffect(() => {
    Cookies.remove('token')

    clearCart()

    void trpcUtils.invalidate().then(() => {
      void navigate(getSignInRoute())
    })
  }, [])

  return <p>Loading...</p>
}
