import DeleteIcon from '@mui/icons-material/Delete'
import KeyIcon from '@mui/icons-material/Key'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
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
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUserNick, setSelectedUserNick] = useState<string>('')
  const [newPassword, setNewPassword] = useState('')

  const { data: users, isLoading, refetch } = trpc.getAllUsers.useQuery()
  const deleteUserMutation = trpc.deleteUser.useMutation()
  const resetPasswordMutation = trpc.resetUserPassword.useMutation()

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

  const handleResetPasswordClick = (userId: string, nick: string) => {
    setSelectedUserId(userId)
    setSelectedUserNick(nick)
    setNewPassword('')
    setPasswordDialogOpen(true)
  }

  const handleResetPasswordConfirm = async () => {
    if (!selectedUserId || !newPassword) {
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        userId: selectedUserId,
        newPassword,
      })
      setPasswordDialogOpen(false)
      setSelectedUserId(null)
      setNewPassword('')
    } catch (error) {
      console.error('Error resetting password:', error)
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
              <TableCell>Дата регистрации</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nick}</TableCell>
                <TableCell>{user.role === 'ADMIN' ? 'Админ' : 'Пользователь'}</TableCell>
                <TableCell>{user._count.orders}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleResetPasswordClick(user.id, user.nick)}
                    title="Сменить пароль"
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Удалить пользователя?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены что хотите удалить пользователя <strong>{selectedUserNick}</strong>?
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

      {/* Reset Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Сменить пароль</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Введите новый пароль для пользователя <strong>{selectedUserNick}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Новый пароль"
            type="text"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={newPassword.length > 0 && newPassword.length < 4}
            helperText={newPassword.length > 0 && newPassword.length < 4 ? 'Минимум 4 символа' : ''}
          />
          {resetPasswordMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {resetPasswordMutation.error.message}
            </Alert>
          )}
          {resetPasswordMutation.isSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Пароль успешно изменён
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={() => void handleResetPasswordConfirm()}
            color="primary"
            variant="contained"
            disabled={!newPassword || newPassword.length < 4 || resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? 'Сохранение...' : 'Сменить пароль'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
