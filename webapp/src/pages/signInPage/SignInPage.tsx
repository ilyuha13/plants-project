import { Button } from '@mui/material'
import { zSignInTrpcInput } from '@plants-project/backend/src/router/signIn/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../components/Alert/Alert'
import { TextInput } from '../../components/TextInput/TextInput'
import { getPlantsListRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import css from './signInPage.module.scss'

export const SignInPage = () => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils()
  const [submittingError, setSubmittingError] = useState<null | string>(null)
  const signIn = trpc.signIn.useMutation()
  const formik = useFormik({
    initialValues: {
      nick: '',
      password: '',
    },
    validate: withZodSchema(zSignInTrpcInput),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null)
        const { token } = await signIn.mutateAsync(values)
        Cookies.set('token', token, { expires: 60 * 60 * 5 })
        void trpcUtils.invalidate()
        navigate(getPlantsListRoute())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setSubmittingError(error.message)
      }
    },
  })

  return (
    <div className={css.container}>
      <form className={css.form} onSubmit={formik.handleSubmit}>
        <h1 className={css.formTitle}> Авторизация </h1>
        <TextInput name="nick" lable="Nick" formik={formik} />
        <TextInput name="password" lable="Password" formik={formik} type="password" />
        {!formik.isValid && !!formik.submitCount && <Alert message="проверьте поля" color="red" />}
        {!!submittingError && <Alert message={submittingError} color="red" />}
        <Button disabled={formik.isSubmitting} type="submit" variant="outlined" color="secondary">
          {formik.isSubmitting ? 'wait...' : 'войти'}
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
