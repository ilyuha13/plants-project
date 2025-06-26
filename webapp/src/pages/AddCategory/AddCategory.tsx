import { zAddCategoriesTrpcInput } from '@plants-project/backend/src/router/addCategories/input'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { TextInput } from '../../components/TextInput/TextInput'
import { useForm } from '../../lib/form'
import { trpc } from '../../lib/trpc'
import css from './addCategory.module.scss'

export const AddCategory = () => {
  const trpcUtils = trpc.useUtils()
  const addCategories = trpc.addCategories.useMutation()
  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: zAddCategoriesTrpcInput,
    resetOnSuccess: true,
    successMessage: 'категория добавлена',
    onSubmit: async (values) => {
      await addCategories.mutateAsync(values)
      trpcUtils.getCategories.invalidate()
    },
  })

  return (
    <div className={css.container}>
      <form
        className={css.form}
        onSubmit={(e) => {
          e.stopPropagation()
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <TextInput name="name" lable="наименование категории" formik={formik} />
        <TextInput name="description" lable="описание" formik={formik} />
        <Button {...buttonProps}>создать категорию</Button>
        {!alertHidden && <Alert {...alertProps} />}
      </form>
    </div>
  )
}
