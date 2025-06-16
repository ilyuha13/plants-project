import { Card, CardMedia } from '@mui/material'
import { zAddPlantTrpcInput } from '@plants-project/backend/src/router/addPlant/input'
import { useState } from 'react'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { ImageInput } from '../../components/ImageInput/ImageInput'
import { SelectInput } from '../../components/Select/Select'
import { TextInput } from '../../components/TextInput/TextInput'
import { env } from '../../lib/env'
import { useForm } from '../../lib/form'
import { trpc } from '../../lib/trpc'
import { AddCategory } from '../AddCategory/AddCategory'
import css from './addPlantPage.module.scss'

export const AddPlantPage = () => {
  const [createCategory, setCreateCategory] = useState(false)
  const addPlant = trpc.addPlant.useMutation()
  const { data, isLoading, isError, isFetching, error } = trpc.getCategories.useQuery()

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

  const onCreateCategoryButtonClick = () => {
    setCreateCategory(true)
  }

  if (isError) {
    return <span>{error.message}</span>
  }

  const categories = data?.categories
  return (
    <div className={css.container}>
      {isLoading || (isFetching && <span>loading...</span>)}
      <h1 className={css.formTitle}> Добавим растение </h1>
      {createCategory && <AddCategory />}
      <form
        className={css.form}
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <SelectInput name="categoryId" lable="выбрать категорию" formik={formik} items={categories} />
        <Button type="button" onClick={onCreateCategoryButtonClick}>
          создать категорию
        </Button>
        <TextInput name="genus" lable="род" formik={formik} />
        <TextInput name="species" lable="вид" formik={formik} />
        <TextInput name="description" lable="описание" formik={formik} />
        <ImageInput name="imageSrc" formik={formik} />
        {!alertHidden && <Alert {...alertProps} />}
        <Button {...buttonProps}>Добавить</Button>
      </form>

      <Card sx={{ maxWidth: 345, marginTop: '20px' }}>
        <CardMedia
          sx={{ height: 180 }}
          image={formik.values.imageSrc ? formik.values.imageSrc : `${env.VITE_BACKEND_URL}/images/logo.jpg`}
        />
      </Card>
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
