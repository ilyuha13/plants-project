import { Button } from '@mui/material'
import { zSignUpTrpcInput } from '@plants-project/backend/src/router/signUp/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Alert } from '../../components/Alert/Alert'
import { TextInput } from '../../components/TextInput/TextInput'
import { getPlantsListRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import css from './signUp.module.scss'

export const SignUpPage = () => {
  const trpcUtils = trpc.useUtils()
  const navigate = useNavigate()
  const [submittingError, setSubmittingError] = useState<null | string>(null)
  const signUp = trpc.signUp.useMutation()
  const formik = useFormik({
    initialValues: {
      nick: '',
      password: '',
      passwordAgain: '',
    },
    validate: withZodSchema(
      zSignUpTrpcInput
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
    ),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null)
        const { token } = await signUp.mutateAsync(values)
        Cookies.set('token', token, { expires: 60 * 60 * 5 })
        navigate(getPlantsListRoute())
        void trpcUtils.invalidate()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setSubmittingError(error.message)
      }
    },
  })

  return (
    <div className={css.container}>
      <form className={css.form} onSubmit={formik.handleSubmit}>
        <h1 className={css.formTitle}> Регистрация </h1>
        <TextInput name="nick" lable="Nick" formik={formik} />
        <TextInput name="password" lable="Password" formik={formik} type="password" />
        <TextInput name="passwordAgain" lable="Password again" formik={formik} type="password" />
        {!formik.isValid && !!formik.submitCount && <Alert message="проверьте поля" color="red" />}{' '}
        {!!submittingError && <Alert message={submittingError} color="red" />}
        <Button disabled={formik.isSubmitting} type="submit" variant="outlined" color="secondary">
          {formik.isSubmitting ? 'wait...' : 'add Plant'}
        </Button>
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
