import { TrpcRouterOutput } from '@plants-project/backend/src/router'
import { zUpdatePlantTrpcInput } from '@plants-project/backend/src/router/updatePlant/input'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { ImageInput } from '../../components/ImageInput/ImageInput'
import { SelectInput } from '../../components/Select/Select'
import { TextInput } from '../../components/TextInput/TextInput'
import { env } from '../../lib/env'
import { useForm } from '../../lib/form'
import { getPlantProfileRoute, TeditPlantParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import { AddCategory } from '../AddCategory/AddCategory'
import css from './editPlantPage.module.scss'

const EditPlantComopnent = ({
  plant,
  categories,
}: {
  plant: NonNullable<TrpcRouterOutput['getPlant']['plant']>
  categories?: NonNullable<TrpcRouterOutput['getCategories']['categories']>
}) => {
  const navigate = useNavigate()
  const [createCategory, setCreateCategory] = useState(false)
  const updatePlant = trpc.updatePlant.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      genus: plant.genus,
      species: plant.species,
      description: plant.description,
      imageSrc: '',
      categoryId: plant.categoryId,
    },
    validationSchema: zUpdatePlantTrpcInput.omit({ plantId: true }),

    onSubmit: async (values) => {
      const changedValues: Partial<typeof values> = {}
      for (const key in values) {
        if (values[key as keyof typeof values] !== plant[key as keyof typeof plant]) {
          changedValues[key as keyof typeof values] = values[key as keyof typeof values]
        }
      }
      if (formik.values.imageSrc) {
        changedValues.imageSrc = formik.values.imageSrc
      } else {
        delete changedValues.imageSrc
      }
      await updatePlant.mutateAsync({
        ...changedValues,
        plantId: plant.plantId,
      })
      navigate(getPlantProfileRoute({ plantId: plant.plantId }))
    },
  })

  const onCreateCategoryButtonClick = () => {
    setCreateCategory(true)
  }

  return (
    <div className={css.container}>
      {!createCategory && (
        <Button type="button" onClick={onCreateCategoryButtonClick}>
          создать категорию
        </Button>
      )}
      {createCategory && <AddCategory />}
      <form className={css.form} onSubmit={formik.handleSubmit}>
        <SelectInput name="categoryId" lable="категория" formik={formik} items={categories} />
        <TextInput name="genus" lable="род" formik={formik} />
        <TextInput name="species" lable="вид" formik={formik} />
        <TextInput name="description" lable="описание" formik={formik} />
        <ImageInput name="imageSrc" formik={formik} />
        {formik.values.imageSrc && <img src={formik.values.imageSrc}></img>}
        {!formik.values.imageSrc && plant.imageUrl && (
          <img src={`${env.VITE_BACKEND_URL}/${plant.imageUrl.replace('public/', '')}`} alt="img" />
        )}
        <Button {...buttonProps}>обновить</Button>
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

export const EditPlantPage = () => {
  const { plantId } = useParams() as TeditPlantParams

  const getPlantResult = trpc.getPlant.useQuery({
    plantId,
  })
  const geteMeResult = trpc.getMe.useQuery()
  const getCategoriesResult = trpc.getCategories.useQuery()

  if (
    getPlantResult.isLoading ||
    geteMeResult.isLoading ||
    getCategoriesResult.isLoading ||
    getPlantResult.isFetching ||
    geteMeResult.isFetching ||
    getCategoriesResult.isFetching
  ) {
    return <span>loading...</span>
  }
  if (getPlantResult.isError) {
    return <span>error: {getPlantResult.error.message}</span>
  }
  if (geteMeResult.isError) {
    return <span>error: {geteMeResult.error.message}</span>
  }
  if (getCategoriesResult.isError) {
    return <span>error: {getCategoriesResult.error.message}</span>
  }
  if (!getPlantResult.data?.plant) {
    return <span>plant not found</span>
  }
  const plant = getPlantResult.data.plant
  const categories = getCategoriesResult.data?.categories

  if (!geteMeResult.data?.me) {
    return <span>you are not authorized</span>
  }
  return <EditPlantComopnent categories={categories} plant={plant} />
}
