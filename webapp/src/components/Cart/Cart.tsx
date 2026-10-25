import BookmarkIcon from '@mui/icons-material/Bookmark'
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
import { requestReservationInput } from '@plants-project/backend/src/router/reservations/input'
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
  const [showReservationForm, setShowReservationForm] = useState(false)
  const utils = trpc.useUtils()
  const checkout = trpc.checkout.useMutation()
  const requestReservation = trpc.requestReservation.useMutation()

  const { data: cartData } = trpc.getCart.useQuery(undefined, {
    enabled: !!me?.id && isOpen,
  })

  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
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

  const {
    formik: reservationFormik,
    buttonProps: reservationButtonProps,
    alertOptions: { hidden: reservationAlertHidden, ...reservationAlertProps },
  } = useForm({
    initialValues: {
      name: '',
      contact: '',
      comment: '',
    },
    validationSchema: requestReservationInput,
    onSubmit: async (values) => {
      await requestReservation.mutateAsync(values)

      await utils.getCart.invalidate()

      setShowReservationForm(false)
      reservationFormik.resetForm()
    },
  })

  const total = items.reduce((sum, item) => {
    return sum + Number(item.plantInstance.price || '0')
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
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5">Корзина</Typography>
          <IconButton onClick={closeCart}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {cartData?.reservationType === 'AUTOMATIC' && cartData?.reservedUntil && (
          <Box sx={{ p: 2 }}>
            <Alert severity="info">
              Автобронь до{' '}
              {new Date(cartData.reservedUntil).toLocaleString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Alert>
          </Box>
        )}

        {cartData?.reservationType === 'AUTOMATIC' &&
          Number(cartData.prepaidAmount || 0) > 0 && (
            <Box sx={{ p: 2 }}>
              <Alert severity="warning">
                Сохранённая предоплата: {String(cartData.prepaidAmount)} ₽. После
                освобождения брони расчёты согласуются с администратором.
              </Alert>
            </Box>
          )}
        {cartData?.reservationType === 'RESERVED_PREPAID_REQUEST' && (
          <Box sx={{ p: 2 }}>
            <Alert severity="info">
              Запрос отправлен. Растения удерживаются до решения администратора.
            </Alert>
          </Box>
        )}
        {cartData?.reservationType === 'RESERVED_PREPAID_CONFIRMED' && (
          <Box sx={{ p: 2 }}>
            <Alert severity="success">
              Бронь подтверждена{' '}
              {cartData.reservedUntil
                ? `до ${new Date(cartData.reservedUntil).toLocaleString('ru-RU')}`
                : 'бессрочно'}
              .
              <br />
              Полученная предоплата: {String(cartData.prepaidAmount || 0)} ₽.
              <br />
              Изменение состава не отменяет условия брони.
              {total < Number(cartData.prepaidAmount || 0) && (
                <Typography>
                  Переплата: {Number(cartData.prepaidAmount) - total} ₽. Свяжитесь с
                  администратором.
                </Typography>
              )}
            </Alert>
          </Box>
        )}

        <Stack spacing={2} sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
          {items.length === 0 ? (
            <Typography color="text.secondary">Корзина пустая</Typography>
          ) : (
            items.map((item) => {
              const { id, plantInstance } = item
              const { plant, price, imagesUrl } = plantInstance
              const imageUrl = getCloudinaryUrl(imagesUrl[0], 'small')

              const name = plant.name
              return (
                <CartItem
                  key={item.id}
                  imageUrl={imageUrl}
                  id={id}
                  name={name}
                  price={price}
                />
              )
            })
          )}
        </Stack>

        {me && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Итого: {total} ₽
              </Typography>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  disabled={items.length === 0}
                  startIcon={<TelegramIcon />}
                  onClick={() => setShowCheckoutForm(true)}
                >
                  Оформить заказ
                </Button>
                {(!cartData || cartData.reservationType === 'AUTOMATIC') && (
                  <>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<BookmarkIcon />}
                      onClick={() => setShowReservationForm(true)}
                    >
                      Запросить бронирование
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
          </>
        )}
      </Drawer>
      <Dialog open={showCheckoutForm} onClose={() => setShowCheckoutForm(false)}>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ minWidth: { xs: 300, sm: 400 } }}>
              <Typography variant="h6">Оформление заказа</Typography>
              {cartData?.prepaidAmount && Number(cartData.prepaidAmount) > 0 && (
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Внесена предоплата:</strong> {String(cartData.prepaidAmount)}{' '}
                    ₽
                  </Typography>
                  <Typography variant="body2">
                    <strong>К оплате:</strong> {total - Number(cartData.prepaidAmount)} ₽
                  </Typography>
                </Alert>
              )}
              <TextInput name="contactInfo.name" label="Ваше имя" formik={formik} />
              <TextInput
                name="contactInfo.phone"
                label="Ваш номер телефона"
                formik={formik}
              />
              <TextInput
                name="contactInfo.telegram"
                label="Ссылка на ваш телеграм (необязательно)"
                formik={formik}
              />
              {!alertHidden && <Alert {...alertProps} />}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCheckoutForm(false)}>Отмена</Button>
            <Button {...buttonProps}>Заказать</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={showReservationForm} onClose={() => setShowReservationForm(false)}>
        <form onSubmit={reservationFormik.handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ minWidth: { xs: 300, sm: 400 } }}>
              <Typography variant="h6">Запрос бронирования</Typography>
              <Typography variant="body2" color="text.secondary">
                Сутки бесплатно после подтверждения администратора. Для долгой брони
                согласуем срок и предоплату. До решения растения удерживаются за вами.
              </Typography>
              <TextInput name="name" label="Ваше имя" formik={reservationFormik} />
              <TextInput
                name="contact"
                label="Телефон, Telegram или VK"
                formik={reservationFormik}
              />
              <TextInput
                name="comment"
                label="Пожелания к бронированию"
                formik={reservationFormik}
              />
              {!reservationAlertHidden && <Alert {...reservationAlertProps} />}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowReservationForm(false)}>Отмена</Button>
            <Button {...reservationButtonProps}>Забронировать</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
