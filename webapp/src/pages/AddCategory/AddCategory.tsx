import { Button } from '@mui/material'
import { zAddCategoriesTrpcInput } from '@plants-project/backend/src/router/addCategories/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import { Alert } from '../../components/Alert/Alert'
import { TextInput } from '../../components/TextInput/TextInput'
import { trpc } from '../../lib/trpc'
import css from './addCategory.module.scss'

export const AddCategory = () => {
  const trpcUtils = trpc.useUtils()
  const [successMassageVisible, setSuccesMesageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<null | string>(null)
  const addCategories = trpc.addCategories.useMutation()
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validate: withZodSchema(zAddCategoriesTrpcInput),
    onSubmit: async (values) => {
      try {
        await addCategories.mutateAsync(values)
        formik.resetForm()
        trpcUtils.getCategories.invalidate()
        setSuccesMesageVisible(true)
        setTimeout(() => {
          setSuccesMesageVisible(false)
        }, 3000)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setSubmittingError(error.message)

        setTimeout(() => {
          setSubmittingError(null)
        }, 3000)
      }
    },
  })

  return (
    <div className={css.container}>
      <form
        className={css.form}
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <TextInput name="name" lable="наименование категории" formik={formik} />
        <TextInput name="description" lable="описание" formik={formik} />
        {!formik.isValid && !!formik.submitCount && <Alert message="проверьте поля" color="red" />}
        {successMassageVisible && <Alert message="успешно" color="green" />}
        {!!submittingError && <Alert message={submittingError} color="red" />}
        <Button disabled={formik.isSubmitting} type="submit" variant="outlined" color="secondary">
          {formik.isSubmitting ? 'wait...' : 'add Categorie'}
        </Button>
      </form>
    </div>
  )
}
