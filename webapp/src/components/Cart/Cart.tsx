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
import { requestReservationNoPrepaidTRPCInput } from '@plants-project/backend/src/router/requestReservationNoPrepaid/input'
import { requestReservationPrepaidTRPCInput } from '@plants-project/backend/src/router/requestReservationPrepaid/input'
import { useEffect, useState } from 'react'

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
  const [showPrepaidReservationForm, setShowPrepaidReservationForm] = useState(false)
  const utils = trpc.useUtils()
  const checkout = trpc.checkout.useMutation()
  const requestReservation = trpc.requestReservationNoPrepaid.useMutation()
  const requestPrepaidReservation = trpc.requestReservationPrepaid.useMutation()

  const { data: cartData } = trpc.getCart.useQuery(
    { userId: me?.id || '' },
    { enabled: !!me?.id && isOpen },
  )

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

  const {
    formik: reservationFormik,
    buttonProps: reservationButtonProps,
    alertOptions: { hidden: reservationAlertHidden, ...reservationAlertProps },
  } = useForm({
    initialValues: {
      cartId: cartData?.id || '',
      name: '',
      phone: '',
      telegramm: '',
    },
    validationSchema: requestReservationNoPrepaidTRPCInput,
    onSubmit: async (values) => {
      await requestReservation.mutateAsync(values)

      await utils.getCart.invalidate()

      setShowReservationForm(false)
      reservationFormik.resetForm()
    },
  })

  const {
    formik: prepaidFormik,
    buttonProps: prepaidButtonProps,
    alertOptions: { hidden: prepaidAlertHidden, ...prepaidAlertProps },
  } = useForm({
    initialValues: {
      cartId: cartData?.id || '',
      name: '',
      phone: '',
      telegramm: '',
    },
    validationSchema: requestReservationPrepaidTRPCInput,
    onSubmit: async (values) => {
      await requestPrepaidReservation.mutateAsync(values)

      await utils.getCart.invalidate()

      setShowPrepaidReservationForm(false)
      prepaidFormik.resetForm()
    },
  })

  const total = items.reduce((sum, item) => {
    return sum + parseInt(item.plantInstance.price || '0', 10)
  }, 0)

  useEffect(() => {
    if (cartData?.id) {
      void reservationFormik.setFieldValue('cartId', cartData.id)
      void prepaidFormik.setFieldValue('cartId', cartData.id)
    }
  }, [cartData?.id])

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

        {cartData?.reservationType === 'RESERVED_NO_PREPAID' &&
          cartData?.reservedUntil && (
            <Box sx={{ p: 2 }}>
              <Alert severity="success">
                Забронировано до{' '}
                {new Date(cartData.reservedUntil).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Alert>
            </Box>
          )}

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

        {cartData?.reservationType === 'RESERVED_PREPAID_REQUEST' && (
          <Box sx={{ p: 2 }}>
            <Alert severity="info">
              Ожидается подтверждение предоплаты администратором
              <br />
              <Typography variant="caption">
                Бронь истекает:{' '}
                {cartData?.reservedUntil &&
                  new Date(cartData.reservedUntil).toLocaleString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </Typography>
            </Alert>
          </Box>
        )}

        {cartData?.reservationType === 'RESERVED_PREPAID_CONFIRMED' && (
          <Box sx={{ p: 2 }}>
            <Alert severity="success">
              Предоплата {String(cartData.prepaidAmount)} ₽ подтверждена
              <br />
              Забронировано до{' '}
              {cartData.reservedUntil &&
                new Date(cartData.reservedUntil).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              <br />
              <Typography variant="caption">
                К оплате: {total - Number(cartData.prepaidAmount || 0)} ₽
              </Typography>
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

        {items.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Итого: {total} ₽
              </Typography>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  startIcon={<TelegramIcon />}
                  onClick={() => setShowCheckoutForm(true)}
                >
                  Оформить заказ
                </Button>
                {cartData?.reservationType === 'AUTOMATIC' && (
                  <>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<BookmarkIcon />}
                      onClick={() => setShowReservationForm(true)}
                    >
                      Забронировать на сутки
                    </Button>
                  </>
                )}
                {(cartData?.reservationType === 'AUTOMATIC' ||
                  cartData?.reservationType === 'RESERVED_NO_PREPAID') && (
                  <>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<BookmarkIcon />}
                      onClick={() => setShowPrepaidReservationForm(true)}
                    >
                      Забронировать с предоплатой
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
              <Typography variant="h6">Бронирование на сутки</Typography>
              <Typography variant="body2" color="text.secondary">
                Для бронирования корзины на 24 часа необходимо указать контактные данные
              </Typography>
              <TextInput name="name" label="Ваше имя" formik={reservationFormik} />
              <TextInput
                name="phone"
                label="Ваш номер телефона"
                formik={reservationFormik}
              />
              <TextInput
                name="telegramm"
                label="Ссылка на ваш телеграм (необязательно)"
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

      <Dialog
        open={showPrepaidReservationForm}
        onClose={() => setShowPrepaidReservationForm(false)}
      >
        <form onSubmit={prepaidFormik.handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ minWidth: { xs: 300, sm: 400 } }}>
              <Typography variant="h6">Бронирование с предоплатой</Typography>
              <Typography variant="body2" color="text.secondary">
                Администратор свяжется с вами для согласования суммы предоплаты. После
                внесения предоплаты корзина будет забронирована на 7 дней.
              </Typography>
              <TextInput name="name" label="Ваше имя" formik={prepaidFormik} />
              <TextInput name="phone" label="Ваш номер телефона" formik={prepaidFormik} />
              <TextInput
                name="telegramm"
                label="Ссылка на ваш телеграм (необязательно)"
                formik={prepaidFormik}
              />
              {!prepaidAlertHidden && <Alert {...prepaidAlertProps} />}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPrepaidReservationForm(false)}>Отмена</Button>
            <Button {...prepaidButtonProps}>Запросить</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
