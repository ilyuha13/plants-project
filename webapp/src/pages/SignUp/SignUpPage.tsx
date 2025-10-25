import { Box, Paper, Stack, Typography } from '@mui/material'
import { zSignUpTrpcInput } from '@plants-project/backend/src/router/signUp/input'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { TextInput } from '../../components/TextInput/TextInput'
import { useForm } from '../../lib/form'
import { getPlantsListRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const SignUpPage = () => {
  const trpcUtils = trpc.useUtils()
  const navigate = useNavigate()
  const signUp = trpc.signUp.useMutation()
  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
      nick: '',
      password: '',
      passwordAgain: '',
    },
    validationSchema: zSignUpTrpcInput
      .extend({
        passwordAgain: z.string().min(1),
      })
      .superRefine((val, ctx) => {
        if (val.password !== val.passwordAgain) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password must be the same',
            path: ['passwprdAgain'],
          })
        }
      }),
    onSubmit: async (values) => {
      const { token } = await signUp.mutateAsync(values)
      Cookies.set('token', token, { expires: 60 * 60 * 5 })
      navigate(getPlantsListRoute())
      void trpcUtils.invalidate()
    },
  })

  return (
    //{TODO: ограничить инпуты}
    <Box>
      <Paper>
        <Stack component="form" onSubmit={formik.handleSubmit} sx={{ p: 2 }}>
          <Typography variant="h2">Регистрация</Typography>
          <TextInput name="nick" label="Nick" formik={formik} />
          <TextInput name="password" label="Password" formik={formik} type="password" />
          <TextInput name="passwordAgain" label="Password again" formik={formik} type="password" />
          <Button {...buttonProps}>создать пользователя</Button>
          {!alertHidden && <Alert {...alertProps} />}
        </Stack>
      </Paper>
    </Box>
  )
}
