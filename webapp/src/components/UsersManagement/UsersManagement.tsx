import ContentCopyIcon from '@mui/icons-material/ContentCopy'
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
  const [resetLinkDialogOpen, setResetLinkDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUserNick, setSelectedUserNick] = useState<string>('')
  const [resetLink, setResetLink] = useState<string>('')
  const [linkCopied, setLinkCopied] = useState(false)

  const { data: users, isLoading, refetch } = trpc.getAllUsers.useQuery()
  const deleteUserMutation = trpc.deleteUser.useMutation()
  const generateResetLinkMutation = trpc.generatePasswordResetToken.useMutation()

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

      {/* Generate Reset Link Dialog */}
      <Dialog open={resetLinkDialogOpen} onClose={() => setResetLinkDialogOpen(false)}>
        <DialogTitle>Сброс пароля</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Сгенерируйте ссылку для сброса пароля пользователя <strong>{selectedUserNick}</strong>.
            <br />
            Отправьте эту ссылку пользователю через email или мессенджер. Ссылка действительна 24 часа.
          </DialogContentText>

          {!resetLink && (
            <Button
              onClick={() => void handleGenerateResetLink()}
              variant="contained"
              disabled={generateResetLinkMutation.isPending}
              fullWidth
            >
              {generateResetLinkMutation.isPending ? 'Генерация...' : 'Сгенерировать ссылку'}
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
    </Box>
  )
}
