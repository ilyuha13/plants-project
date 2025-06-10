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
import css from './signUp.module.scss'

export const SignUpPage = () => {
  const trpcUtils = trpc.useUtils()
  const navigate = useNavigate()
  const signUp = trpc.signUp.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
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
    <div className={css.container}>
      <form className={css.form} onSubmit={formik.handleSubmit}>
        <h1 className={css.formTitle}> Регистрация </h1>
        <TextInput name="nick" lable="Nick" formik={formik} />
        <TextInput name="password" lable="Password" formik={formik} type="password" />
        <TextInput name="passwordAgain" lable="Password again" formik={formik} type="password" />
        <Button {...buttonProps}>создать пользователя</Button>
        <Alert {...alertProps} />
      </form>
      {/* <PlantCard
        key={plant.plantId}
        genus={plant.genus}
        species={plant.species}
        description={plant.description}
        plantId={plant.plantId}
      /> */}
    </div>
  )
}
