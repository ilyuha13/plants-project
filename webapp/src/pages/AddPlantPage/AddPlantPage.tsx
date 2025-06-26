import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { zAddPlantTrpcInput } from '@plants-project/backend/src/router/addPlant/input'
import { useDialogs, DialogProps } from '@toolpad/core/useDialogs'
//import { useState } from 'react'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { ImageInput } from '../../components/ImageInput/ImageInput'
import { SelectInput } from '../../components/Select/Select'
import { TextInput } from '../../components/TextInput/TextInput'
import { PlantCard } from '../../components/plantCard/plantCard'
import { useForm } from '../../lib/form'
import { trpc } from '../../lib/trpc'
import { AddCategory } from '../AddCategory/AddCategory'
import css from './addPlantPage.module.scss'

export const AddPlantPage = () => {
  //const [createCategory, setCreateCategory] = useState(false)
  const dialogs = useDialogs()
  //const [open, setOpen] = useState(false)
  const addPlant = trpc.addPlant.useMutation()
  const { data, isLoading, isError, isFetching, error } = trpc.getCategories.useQuery()

  const MyCustomDialog = ({ open, onClose }: DialogProps) => {
    return (
      <Dialog fullWidth open={open} onClose={() => onClose()}>
        <DialogContent>
          <AddCategory />
        </DialogContent>

        <DialogActions>
          <Button type="button" onClick={() => onClose()}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  // const handleClickOpen = () => {
  //   setOpen(true)
  // }
  // const handleClose = () => {
  //   setOpen(false)
  // }

  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
      genus: '',
      species: '',
      description: '',
      categoryId: '',
      imageSrc: '',
    },
    validationSchema: zAddPlantTrpcInput,
    onSubmit: async (values) => {
      await addPlant.mutateAsync(values)
    },
    successMessage: 'растение добавленно',
    showValidationAlert: true,
    resetOnSuccess: true,
  })

  // const onCreateCategoryButtonClick = () => {
  //   setCreateCategory(true)
  // }

  if (isError) {
    return <span>{error.message}</span>
  }

  const categories = data?.categories
  return (
    <div className={css.container}>
      {isLoading || (isFetching && <span>loading...</span>)}
      {/* {createCategory && <AddCategory />} */}
      <form
        className={css.form}
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <Typography variant="h5">Добавим растение</Typography>
        <div className={css.inputContainer}>
          <SelectInput name="categoryId" lable="выбрать категорию" formik={formik} items={categories} />
          <Button
            type="button"
            onClick={async () => {
              await dialogs.open(MyCustomDialog)
            }}
          >
            создать категорию
          </Button>
        </div>

        <TextInput name="genus" lable="род" formik={formik} />
        <TextInput name="species" lable="вид" formik={formik} />
        <TextInput name="description" lable="описание" formik={formik} />
        <ImageInput name="imageSrc" formik={formik} />
        {!alertHidden && <Alert {...alertProps} />}

        <Button {...buttonProps}>Добавить</Button>
      </form>
      <PlantCard
        plantId="new"
        genus={formik.values.genus ? formik.values.genus : 'genus'}
        species={formik.values.species ? formik.values.species : 'species'}
        description={formik.values.description ? formik.values.description : 'description'}
        createdAt={new Date()}
        categoryId={formik.values.categoryId}
        imageUrl={formik.values.imageSrc ? formik.values.imageSrc : 'public/images/logo.jpg'}
      />
    </div>
  )
}
