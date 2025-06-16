import { zSignInTrpcInput } from '@plants-project/backend/src/router/signIn/input'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { TextInput } from '../../components/TextInput/TextInput'
import { useForm } from '../../lib/form'
import { getPlantsListRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import css from './signInPage.module.scss'

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
    <div className={css.container}>
      <form className={css.form} onSubmit={formik.handleSubmit}>
        <h1 className={css.formTitle}> Авторизация </h1>
        <TextInput name="nick" lable="Nick" formik={formik} />
        <TextInput name="password" lable="Password" formik={formik} type="password" />
        <Button {...buttonProps}>Sign In</Button>
        {!alertHidden && <Alert {...alertProps} />}
      </form>
    </div>
  )
}
