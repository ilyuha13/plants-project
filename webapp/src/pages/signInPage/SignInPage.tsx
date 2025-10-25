import { Box, Paper, Stack, Typography } from '@mui/material'
import { zSignInTrpcInput } from '@plants-project/backend/src/router/signIn/input'
import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { TextInput } from '../../components/TextInput/TextInput'
import { useForm } from '../../lib/form'
import { getPlantsListRoute, getSignUpRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const SignInPage = () => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils()
  const signIn = trpc.signIn.useMutation()
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
      navigate(getPlantsListRoute())
    },
  })

  return (
    //{TODO: ограничить инпуты}
    <Box>
      <Paper>
        <Stack sx={{ p: 2 }}>
          <Stack component="form" onSubmit={formik.handleSubmit}>
            <Typography variant="h2">Авторизация</Typography>
            <TextInput name="nick" label="Nick" formik={formik} />
            <TextInput name="password" label="Password" formik={formik} type="password" />
            <Button {...buttonProps}>войти</Button>
            {!alertHidden && <Alert {...alertProps} />}
          </Stack>
          <Link to={getSignUpRoute()}>зарегистрироваться</Link>
        </Stack>
      </Paper>
    </Box>
  )
}
