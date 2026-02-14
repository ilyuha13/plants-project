import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyIcon from '@mui/icons-material/Key'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import { trpc } from '../../lib/trpc'

export const UsersManagement = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resetLinkDialogOpen, setResetLinkDialogOpen] = useState(false)
  const [confirmPrepaidDialogOpen, setConfirmPrepaidDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUserNick, setSelectedUserNick] = useState<string>('')
  const [selectedCartId, setSelectedCartId] = useState<string>('')
  const [resetLink, setResetLink] = useState<string>('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [prepaidAmount, setPrepaidAmount] = useState<string>('')
  const [daysCount, setDaysCount] = useState<number>(7)

  const { data: users, isLoading, refetch } = trpc.getAllUsers.useQuery()
  const deleteUserMutation = trpc.deleteUser.useMutation()
  const generateResetLinkMutation = trpc.generatePasswordResetToken.useMutation()
  const confirmPrepaidMutation = trpc.confirmPrepaidPayment.useMutation()
  const rejectReservationMutation = trpc.rejectReservationRequest.useMutation()
  const utils = trpc.useUtils()

  const handleDeleteClick = (userId: string, nick: string) => {
    setSelectedUserId(userId)
    setSelectedUserNick(nick)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUserId) {
      return
    }

    try {
      await deleteUserMutation.mutateAsync({ userId: selectedUserId })
      setDeleteDialogOpen(false)
      setSelectedUserId(null)
      void refetch()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleGenerateResetLinkClick = (userId: string, nick: string) => {
    setSelectedUserId(userId)
    setSelectedUserNick(nick)
    setResetLink('')
    setLinkCopied(false)
    setResetLinkDialogOpen(true)
  }

  const handleGenerateResetLink = async () => {
    if (!selectedUserId) {
      return
    }

    try {
      const result = await generateResetLinkMutation.mutateAsync({
        userId: selectedUserId,
      })
      setResetLink(result.resetLink)
    } catch (error) {
      console.error('Error generating reset link:', error)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resetLink)
      setLinkCopied(true)
      // Сбросим статус "скопировано" через 2 секунды
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const handleConfirmPrepaidClick = (cartId: string, userNick: string) => {
    setSelectedCartId(cartId)
    setSelectedUserNick(userNick)
    setPrepaidAmount('')
    setDaysCount(7)
    setConfirmPrepaidDialogOpen(true)
  }

  const handleConfirmPrepaid = async () => {
    if (!selectedCartId || !prepaidAmount) {
      return
    }

    try {
      await confirmPrepaidMutation.mutateAsync({
        cartId: selectedCartId,
        prepaidAmount,
        daysCount,
      })
      setConfirmPrepaidDialogOpen(false)
      await utils.getPendingReservationRequests.invalidate()
      void refetch()
    } catch (error) {
      console.error('Error confirming prepaid:', error)
    }
  }

  const handleRejectReservation = async () => {
    if (!selectedCartId) {
      return
    }

    try {
      await rejectReservationMutation.mutateAsync({
        cartId: selectedCartId,
      })
      setConfirmPrepaidDialogOpen(false)
      void refetch()
    } catch (error) {
      console.error('Error rejecting reservation:', error)
    }
  }

  if (isLoading) {
    return <Typography>Загрузка...</Typography>
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Управление пользователями
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Никнейм</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Заказов</TableCell>
              <TableCell>Корзина</TableCell>
              <TableCell>Дата регистрации</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => {
              const cart = user.cart
              if (!cart) {
                return
              }
              const isPendingPrepaid =
                cart?.reservationType === 'RESERVED_PREPAID_REQUEST'
              const totalAmount =
                cart?.items?.reduce(
                  (sum, item) => sum + Number(item.plantInstance.price),
                  0,
                ) || 0

              return (
                <TableRow
                  key={user.id}
                  sx={{
                    bgcolor: isPendingPrepaid ? 'warning.light' : 'inherit',
                  }}
                >
                  <TableCell>{user.nick}</TableCell>
                  <TableCell>
                    {user.role === 'ADMIN' ? 'Админ' : 'Пользователь'}
                  </TableCell>
                  <TableCell>{user._count.orders}</TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      {cart.reservationType === 'AUTOMATIC' && (
                        <Chip label="Автобронь" size="small" color="default" />
                      )}
                      {cart.reservationType === 'RESERVED_NO_PREPAID' && (
                        <Chip label="Сутки" size="small" color="success" />
                      )}
                      {cart.reservationType === 'RESERVED_PREPAID_REQUEST' && (
                        <Chip label="Ждет предоплаты" size="small" color="warning" />
                      )}
                      {cart.reservationType === 'RESERVED_PREPAID_CONFIRMED' && (
                        <Chip
                          label={`предоплата ${cart.prepaidAmount}₽`}
                          size="small"
                          color="success"
                        />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {cart.items.length} шт · {totalAmount} ₽
                      </Typography>
                      {cart.reservedUntil && (
                        <Typography variant="caption" color="text.secondary">
                          до{' '}
                          {new Date(cart.reservedUntil).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell align="right">
                    {isPendingPrepaid && cart && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleConfirmPrepaidClick(cart.id, user.nick)}
                        title="Подтвердить предоплату"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleGenerateResetLinkClick(user.id, user.nick)}
                      title="Сгенерировать ссылку для сброса пароля"
                    >
                      <KeyIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(user.id, user.nick)}
                      title="Удалить пользователя"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Удалить пользователя?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены что хотите удалить пользователя <strong>{selectedUserNick}</strong>
            ?
            <br />
            Это действие нельзя отменить. Все заказы пользователя также будут удалены.
          </DialogContentText>
          {deleteUserMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteUserMutation.error.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={() => void handleDeleteConfirm()}
            color="error"
            variant="contained"
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Reset Link Dialog */}
      <Dialog open={resetLinkDialogOpen} onClose={() => setResetLinkDialogOpen(false)}>
        <DialogTitle>Сброс пароля</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Сгенерируйте ссылку для сброса пароля пользователя{' '}
            <strong>{selectedUserNick}</strong>.
            <br />
            Отправьте эту ссылку пользователю через email или мессенджер. Ссылка
            действительна 24 часа.
          </DialogContentText>

          {!resetLink && (
            <Button
              onClick={() => void handleGenerateResetLink()}
              variant="contained"
              disabled={generateResetLinkMutation.isPending}
              fullWidth
            >
              {generateResetLinkMutation.isPending
                ? 'Генерация...'
                : 'Сгенерировать ссылку'}
            </Button>
          )}

          {resetLink && (
            <>
              <TextField
                label="Ссылка для сброса пароля"
                value={resetLink}
                fullWidth
                variant="outlined"
                margin="dense"
                InputProps={{
                  readOnly: true,
                }}
                multiline
                rows={3}
              />
              <Button
                onClick={() => void handleCopyLink()}
                variant="contained"
                color={linkCopied ? 'success' : 'primary'}
                startIcon={<ContentCopyIcon />}
                fullWidth
                sx={{ mt: 2 }}
              >
                {linkCopied ? 'Скопировано!' : 'Скопировать ссылку'}
              </Button>
            </>
          )}

          {generateResetLinkMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {generateResetLinkMutation.error.message}
            </Alert>
          )}

          {generateResetLinkMutation.isSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Ссылка успешно создана
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetLinkDialogOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Prepaid Payment Dialog */}
      <Dialog
        open={confirmPrepaidDialogOpen}
        onClose={() => setConfirmPrepaidDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Подтверждение предоплаты</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Подтвердите получение предоплаты от пользователя{' '}
            <strong>{selectedUserNick}</strong>
          </DialogContentText>

          {users?.find((u) => u.cart?.id === selectedCartId)?.cart && (
            <>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Состав корзины:
              </Typography>
              <List dense>
                {users
                  .find((u) => u.cart?.id === selectedCartId)
                  ?.cart?.items?.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.plantInstance.plant.name}
                        secondary={`${item.plantInstance.price} ₽`}
                      />
                    </ListItem>
                  ))}
              </List>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Итого:{' '}
                {users
                  .find((u) => u.cart?.id === selectedCartId)
                  ?.cart?.items?.reduce(
                    (sum, item) => sum + Number(item.plantInstance.price),
                    0,
                  )}{' '}
                ₽
              </Typography>
            </>
          )}

          <TextField
            label="Сумма предоплаты (руб)"
            type="number"
            value={prepaidAmount}
            onChange={(e) => setPrepaidAmount(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />

          <TextField
            label="Количество дней бронирования"
            type="number"
            value={daysCount}
            onChange={(e) => setDaysCount(Number(e.target.value))}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 1, max: 30 }}
            helperText="По умолчанию 7 дней"
          />

          {confirmPrepaidMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {confirmPrepaidMutation.error.message}
            </Alert>
          )}

          {rejectReservationMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {rejectReservationMutation.error.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => void handleRejectReservation()}
            color="error"
            disabled={rejectReservationMutation.isPending}
            startIcon={<CancelIcon />}
          >
            Отклонить
          </Button>
          <Button onClick={() => setConfirmPrepaidDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={() => void handleConfirmPrepaid()}
            variant="contained"
            color="success"
            disabled={!prepaidAmount || confirmPrepaidMutation.isPending}
            startIcon={<CheckCircleIcon />}
          >
            {confirmPrepaidMutation.isPending ? 'Подтверждение...' : 'Подтвердить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
