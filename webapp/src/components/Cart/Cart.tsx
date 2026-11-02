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
  MenuItem,
  TextField,
  Stack,
  Typography,
} from '@mui/material'
import {
  normalizeTelegram,
  normalizeVk,
} from '@plants-project/backend/src/lib/customerContacts'
import {
  deliveryOptions,
  deliveryNeedsAddress,
  deliveryNeedsRecipient,
  deliveryNeedsPickupPoint,
  deliveryCodes,
  hasRecipientPhone,
} from '@plants-project/backend/src/lib/deliveryOptions'
import { orderStatusLabel } from '@plants-project/backend/src/lib/orderProcessing'
import { checkoutInput } from '@plants-project/backend/src/router/cart/checkout/input'
import { requestReservationInput } from '@plants-project/backend/src/router/reservations/input'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { getCloudinaryUrl } from '../../lib/cloudinaryUrlGenerator'
import { useMe } from '../../lib/ctx'
import { useForm } from '../../lib/form'
import { getOrderDetailRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import { useCartStore } from '../../stores/cartStore'
import { CartItem } from '../CartItem/CartItem'
import { TextInput } from '../TextInput/TextInput'

import type { DeliveryCode } from '@plants-project/backend/src/lib/deliveryOptions'

export const Cart = () => {
  const items = useCartStore((state) => state.items)
  const isOpen = useCartStore((state) => state.isOpen)
  const closeCart = useCartStore((state) => state.closeCart)
  const me = useMe()

  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const utils = trpc.useUtils()
  const checkout = trpc.checkout.useMutation()
  const { data: myOrders } = trpc.getMyOrders.useQuery(undefined, {
    enabled: !!me && isOpen,
  })
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
      deliveryType: null as DeliveryCode | null,
      deliveryAddress: '',
      pickupPoint: '',
      deliveryNotes: '',
      contactInfo: {
        firstName: '',
        lastName: '',
        patronymic: '',
        phone: '',
        telegram: '',
        vk: '',
      },
    },
    validationSchema: checkoutInput,
    onSubmit: async (values) => {
      await checkout.mutateAsync(values)

      await utils.getCart.invalidate()
      await utils.getPlants.invalidate()

      setShowCheckoutForm(false)

      formik.resetForm()
      await utils.getMe.invalidate()
    },
  })

  const {
    formik: reservationFormik,
    buttonProps: reservationButtonProps,
    alertOptions: { hidden: reservationAlertHidden, ...reservationAlertProps },
  } = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      patronymic: '',
      phone: '',
      telegram: '',
      vk: '',
      comment: '',
    },
    validationSchema: requestReservationInput,
    onSubmit: async (values) => {
      await requestReservation.mutateAsync(values)

      await utils.getCart.invalidate()

      setShowReservationForm(false)
      reservationFormik.resetForm()
      await utils.getMe.invalidate()
    },
  })

  const legacyContact = cartData?.customerContact || me?.customerContact || ''
  const legacyVk =
    /(?:vk\.com|vk\.ru)\//i.test(legacyContact) && !legacyContact.includes('\n')
      ? legacyContact.replace(/^ВКонтакте: /, '')
      : ''
  const legacyTelegram =
    !legacyVk &&
    !legacyContact.includes('\n') &&
    /^(?:@|https?:\/\/(?:t\.me|telegram\.me)\/|Telegram: )/i.test(legacyContact)
      ? legacyContact.replace(/^Telegram: /, '')
      : ''
  const savedNames = {
    firstName: cartData?.customerFirstName ?? me?.customerFirstName ?? '',
    lastName: cartData?.customerLastName ?? me?.customerLastName ?? '',
    patronymic: cartData?.customerPatronymic ?? me?.customerPatronymic ?? '',
  }
  const legacyName = !savedNames.firstName
    ? cartData?.customerName || me?.customerName
    : null
  const savedContacts = {
    phone:
      cartData?.customerPhone ??
      me?.customerPhone ??
      (hasRecipientPhone(legacyContact) ? legacyContact : ''),
    telegram: cartData?.customerTelegram ?? me?.customerTelegram ?? legacyTelegram,
    vk: cartData?.customerVk ?? me?.customerVk ?? legacyVk,
  }

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
        {cartData?.purchaseRequestedAt && (
          <Box sx={{ p: 2 }}>
            <Alert severity="success">
              Заявка на покупку отправлена. Растения удерживаются; администратор согласует
              состав, доставку и оплату. Заказ появится после подтверждения полной оплаты.
            </Alert>
          </Box>
        )}
        {!!myOrders?.orders.length && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Активные заказы</Typography>
            {myOrders.orders.map((order) => (
              <Button
                key={order.id}
                component={RouterLink}
                to={getOrderDetailRoute({ orderId: order.id })}
                onClick={closeCart}
                fullWidth
              >
                {new Date(order.createdAt).toLocaleDateString('ru-RU')} ·{' '}
                {String(order.totalAmount)} ₽ · {orderStatusLabel[order.status]}
              </Button>
            ))}
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
                  disabled={items.length === 0 || !!cartData?.purchaseRequestedAt}
                  startIcon={<TelegramIcon />}
                  onClick={() => {
                    const deliveryType = cartData?.deliveryType ?? me.deliveryType
                    formik.resetForm({
                      values: {
                        contactInfo: {
                          ...savedNames,
                          ...savedContacts,
                        },
                        deliveryType:
                          deliveryCodes.find((code) => code === deliveryType) ?? null,
                        deliveryAddress:
                          cartData?.deliveryAddress || me.deliveryAddress || '',
                        pickupPoint: cartData?.pickupPoint || me.pickupPoint || '',
                        deliveryNotes: cartData?.deliveryNotes || me.deliveryNotes || '',
                      },
                    })
                    setShowCheckoutForm(true)
                  }}
                >
                  Оформить покупку
                </Button>
                {(!cartData || cartData.reservationType === 'AUTOMATIC') && (
                  <>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<BookmarkIcon />}
                      onClick={() => {
                        reservationFormik.resetForm({
                          values: {
                            ...savedNames,
                            ...savedContacts,
                            comment:
                              cartData?.customerComment || me.reservationComment || '',
                          },
                        })
                        setShowReservationForm(true)
                      }}
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
              <Typography variant="h6">Заявка на покупку</Typography>
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
              {legacyName && (
                <Alert severity="info">
                  Ранее указано: {legacyName}. Уточните имя, фамилию и отчество в
                  отдельных полях.
                </Alert>
              )}
              <TextInput name="contactInfo.firstName" label="Имя" formik={formik} />
              <TextInput
                name="contactInfo.lastName"
                label={
                  deliveryNeedsRecipient(formik.values.deliveryType)
                    ? 'Фамилия (обязательно)'
                    : 'Фамилия'
                }
                formik={formik}
              />
              <TextInput
                name="contactInfo.patronymic"
                label="Отчество (необязательно)"
                formik={formik}
              />
              <TextInput
                name="contactInfo.phone"
                label={
                  deliveryNeedsRecipient(formik.values.deliveryType)
                    ? 'Телефон получателя (обязательно)'
                    : 'Ваш номер телефона'
                }
                formik={formik}
              />
              <TextInput
                name="contactInfo.telegram"
                label="Telegram"
                formik={formik}
                placeholder="@username"
                helperText="Введите имя пользователя с @ или без него либо ссылку t.me/username. Имя пользователя можно найти в настройках Telegram."
                normalize={normalizeTelegram}
              />
              <TextInput
                name="contactInfo.vk"
                label="ВКонтакте"
                formik={formik}
                placeholder="https://vk.com/username"
                helperText="Откройте свою страницу ВКонтакте и скопируйте ссылку через «Поделиться». Подойдёт vk.com/username или vk.com/id123456, также можно ввести username или id123456."
                normalize={normalizeVk}
              />
              <Typography variant="body2" color="text.secondary">
                Укажите хотя бы один контакт: телефон, Telegram или ВКонтакте.
              </Typography>
              <TextField
                select
                label="Способ получения"
                value={formik.values.deliveryType || ''}
                onChange={(event) =>
                  void formik.setFieldValue('deliveryType', event.target.value || null)
                }
              >
                <MenuItem value="">Согласуем лично</MenuItem>
                {deliveryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {deliveryNeedsPickupPoint(formik.values.deliveryType) && (
                <TextInput
                  name="pickupPoint"
                  label="Адрес ПВЗ и номер пункта (если известен)"
                  formik={formik}
                />
              )}
              {deliveryNeedsAddress(formik.values.deliveryType) && (
                <TextInput
                  name="deliveryAddress"
                  label={
                    formik.values.deliveryType === 'POST'
                      ? 'Почтовый адрес с индексом'
                      : 'Адрес доставки по городу'
                  }
                  formik={formik}
                />
              )}
              <TextInput
                name="deliveryNotes"
                label="Пожелания к доставке"
                formik={formik}
              />
              <Typography>Окончательную стоимость и оплату согласуем лично.</Typography>
              {!alertHidden && <Alert {...alertProps} />}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCheckoutForm(false)}>Отмена</Button>
            <Button {...buttonProps}>Отправить заявку</Button>
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
              {legacyName && (
                <Alert severity="info">
                  Ранее указано: {legacyName}. Уточните имя, фамилию и отчество в
                  отдельных полях.
                </Alert>
              )}
              <TextInput name="firstName" label="Имя" formik={reservationFormik} />
              <TextInput name="lastName" label="Фамилия" formik={reservationFormik} />
              <TextInput
                name="patronymic"
                label="Отчество (необязательно)"
                formik={reservationFormik}
              />
              <TextInput
                name="phone"
                label="Ваш номер телефона"
                formik={reservationFormik}
              />
              <TextInput
                name="telegram"
                label="Telegram"
                formik={reservationFormik}
                placeholder="@username"
                helperText="Введите имя пользователя с @ или без него либо ссылку t.me/username. Имя пользователя можно найти в настройках Telegram."
                normalize={normalizeTelegram}
              />
              <TextInput
                name="vk"
                label="ВКонтакте"
                formik={reservationFormik}
                placeholder="https://vk.com/username"
                helperText="Откройте свою страницу ВКонтакте и скопируйте ссылку через «Поделиться». Подойдёт vk.com/username или vk.com/id123456, также можно ввести username или id123456."
                normalize={normalizeVk}
              />
              <Typography variant="body2" color="text.secondary">
                Укажите хотя бы один контакт: телефон, Telegram или ВКонтакте.
              </Typography>
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
