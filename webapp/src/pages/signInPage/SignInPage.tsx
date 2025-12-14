import {
  Alert as MuiAlert,
  Box,
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { zSignInTrpcInput } from '@plants-project/backend/src/router/signIn/input'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { TextInput } from '../../components/TextInput/TextInput'
import { useForm } from '../../lib/form'
import { getCatalogPageRoute, getSignUpRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const SignInPage = () => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils()
  const signIn = trpc.signIn.useMutation()

  // State для диалога "Забыл пароль"
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false)
  const [resetNick, setResetNick] = useState('')
  const [resetContactInfo, setResetContactInfo] = useState('')

  const requestPasswordReset = trpc.requestPasswordReset.useMutation()
  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
      nick: '',
      password: '',
    },
    validationSchema: zSignInTrpcInput,
    onSubmit: async (values) => {
      const { token } = await signIn.mutateAsync(values)
      Cookies.set('token', token, { expires: 60 * 60 * 5 })
      void trpcUtils.invalidate()
      void navigate(getCatalogPageRoute())
    },
  })

  const handleForgotPasswordSubmit = async () => {
    if (!resetNick || !resetContactInfo) {
      return
    }

    try {
      await requestPasswordReset.mutateAsync({
        nick: resetNick,
        contactInfo: resetContactInfo,
      })
      // После успеха закрываем диалог и очищаем форму
      setForgotPasswordDialogOpen(false)
      setResetNick('')
      setResetContactInfo('')
    } catch (error) {
      console.error('Error requesting password reset:', error)
    }
  }

  return (
    <Box>
      <Paper
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          minHeight: '70vh',
        }}
      >
        <Stack
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            maxWidth: 600,
            width: '100%',
          }}
        >
          <Typography variant="h2">Авторизация</Typography>
          <TextInput name="nick" label="Имя пользователя" formik={formik} />
          <TextInput name="password" label="Пароль" formik={formik} type="password" />
          <Button {...buttonProps}>войти</Button>
          {!alertHidden && <Alert {...alertProps} />}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="text" onClick={() => void navigate(getSignUpRoute())}>
              зарегистрироваться
            </Button>
            <Button variant="text" onClick={() => setForgotPasswordDialogOpen(true)}>
              забыл пароль?
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Диалог "Забыл пароль" */}
      <Dialog open={forgotPasswordDialogOpen} onClose={() => setForgotPasswordDialogOpen(false)}>
        <DialogTitle>Восстановление пароля</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Введите ваш никнейм и контактные данные (телефон, email или Telegram). Администратор свяжется с вами для
            восстановления доступа к аккаунту.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Никнейм"
            type="text"
            fullWidth
            variant="outlined"
            value={resetNick}
            onChange={(e) => setResetNick(e.target.value)}
            error={resetNick.length > 0 && !resetNick}
            helperText={resetNick.length > 0 && !resetNick ? 'Введите никнейм' : ''}
          />

          <TextField
            margin="dense"
            label="Контактные данные (телефон, email, Telegram)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={resetContactInfo}
            onChange={(e) => setResetContactInfo(e.target.value)}
            error={resetContactInfo.length > 0 && !resetContactInfo}
            helperText={resetContactInfo.length > 0 && !resetContactInfo ? 'Введите контактные данные' : ''}
          />

          {requestPasswordReset.isError && (
            <MuiAlert severity="error" sx={{ mt: 2 }}>
              {requestPasswordReset.error.message}
            </MuiAlert>
          )}

          {requestPasswordReset.isSuccess && (
            <MuiAlert severity="success" sx={{ mt: 2 }}>
              {requestPasswordReset.data.message}
            </MuiAlert>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setForgotPasswordDialogOpen(false)}>Отмена</MuiButton>
          <MuiButton
            onClick={() => void handleForgotPasswordSubmit()}
            variant="contained"
            disabled={!resetNick || !resetContactInfo || requestPasswordReset.isPending}
          >
            {requestPasswordReset.isPending ? 'Отправка...' : 'Отправить запрос'}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
