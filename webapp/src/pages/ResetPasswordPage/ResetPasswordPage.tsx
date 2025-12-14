import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { getSignInRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Получаем токен из URL параметра ?token=xxx
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Используем публичный роут resetPasswordWithToken
  const resetPasswordMutation = trpc.resetPasswordWithToken.useMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      return
    }

    // Проверка что пароли совпадают
    if (newPassword !== confirmPassword) {
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword,
      })

      // Через 2 секунды перенаправляем на страницу входа
      setTimeout(() => {
        void navigate(getSignInRoute())
      }, 2000)
    } catch (error) {
      console.error('Error resetting password:', error)
    }
  }

  // Если токен отсутствует в URL
  if (!token) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Alert severity="error">Недействительная ссылка. Токен отсутствует.</Alert>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Сброс пароля
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Введите новый пароль для вашего аккаунта
        </Typography>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <TextField
            label="Новый пароль"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={newPassword.length > 0 && newPassword.length < 4}
            helperText={newPassword.length > 0 && newPassword.length < 4 ? 'Минимум 4 символа' : ''}
            required
            disabled={resetPasswordMutation.isSuccess}
          />

          <TextField
            label="Повторите пароль"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword.length > 0 && confirmPassword !== newPassword}
            helperText={confirmPassword.length > 0 && confirmPassword !== newPassword ? 'Пароли не совпадают' : ''}
            required
            disabled={resetPasswordMutation.isSuccess}
          />

          {resetPasswordMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {resetPasswordMutation.error.message}
            </Alert>
          )}

          {resetPasswordMutation.isSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Пароль успешно изменён! Перенаправление на страницу входа...
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={
              !newPassword ||
              !confirmPassword ||
              newPassword.length < 4 ||
              newPassword !== confirmPassword ||
              resetPasswordMutation.isPending ||
              resetPasswordMutation.isSuccess
            }
          >
            {resetPasswordMutation.isPending ? 'Сохранение...' : 'Сменить пароль'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}
