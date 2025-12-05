import CloseIcon from '@mui/icons-material/Close'
import TelegramIcon from '@mui/icons-material/Telegram'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { checkoutInput } from '@plants-project/backend/src/router/cart/checkout/input'
import { useState } from 'react'

import { getCloudinaryUrl } from '../../lib/cloudinaryUrlGenerator'
import { useMe } from '../../lib/ctx'
import { useForm } from '../../lib/form'
import { trpc } from '../../lib/trpc'
import { useCartStore } from '../../stores/cartStore'
import { CartItem } from '../CartItem/CartItem'
import { TextInput } from '../TextInput/TextInput'

export const Cart = () => {
  const items = useCartStore((state) => state.items)
  const isOpen = useCartStore((state) => state.isOpen)
  const closeCart = useCartStore((state) => state.closeCart)
  const me = useMe()

  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const utils = trpc.useUtils()
  const checkout = trpc.checkout.useMutation()

  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
      userId: me?.id || '',
      contactInfo: {
        name: '',
        phone: '',
        telegram: '',
      },
    },
    validationSchema: checkoutInput,
    onSubmit: async (values) => {
      await checkout.mutateAsync(values)

      await utils.getCart.invalidate()
      await utils.getPlants.invalidate()

      setShowCheckoutForm(false)
      closeCart()

      formik.resetForm()
    },
  })

  const total = items.reduce((sum, item) => {
    return sum + parseInt(item.plantInstance.price || '0', 10)
  }, 0)

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={closeCart}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Корзина</Typography>
          <IconButton onClick={closeCart}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Stack spacing={2} sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
          {items.length === 0 ? (
            <Typography color="text.secondary">Корзина пустая</Typography>
          ) : (
            items.map((item) => {
              const { id, plantInstance } = item
              const { plant, price, imagesUrl } = plantInstance
              const imageUrl = getCloudinaryUrl(imagesUrl[0], 'small')

              const name = plant.name
              return <CartItem key={item.id} imageUrl={imageUrl} id={id} name={name} price={price} />
            })
          )}
        </Stack>

        {items.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Итого: {total} ₽
              </Typography>
              <Button startIcon={<TelegramIcon />} onClick={() => setShowCheckoutForm(true)}>
                Оформить заказ
              </Button>
            </Box>
          </>
        )}
      </Drawer>
      <Dialog open={showCheckoutForm} onClose={() => setShowCheckoutForm(false)}>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ minWidth: { xs: 300, sm: 400 } }}>
              <Typography variant="h6">Оформление заказа</Typography>
              <TextInput name="contactInfo.name" label="Ваше имя" formik={formik} />
              <TextInput name="contactInfo.phone" label="Ваш номер телефона" formik={formik} />
              <TextInput name="contactInfo.telegram" label="Ссылка на ваш телеграм (необязательно)" formik={formik} />
              {!alertHidden && <Alert {...alertProps} />}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCheckoutForm(false)}>Отмена</Button>
            <Button {...buttonProps}>Заказать</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
