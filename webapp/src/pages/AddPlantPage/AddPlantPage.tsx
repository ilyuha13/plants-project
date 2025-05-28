import { Button } from '@mui/material'
import { zAddPlantTrpcInput } from '@plants-project/backend/src/router/addPlant/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import { Alert } from '../../components/Alert/Alert'
import { ImageInput } from '../../components/ImageInput/ImageInput'
import { SelectInput } from '../../components/Select/Select'
import { TextInput } from '../../components/TextInput/TextInput'
//import { PlantCard } from '../../components/plantCard/plantCard'
import { trpc } from '../../lib/trpc'
import { AddCategory } from '../AddCategory/AddCategory'
import css from './addPlantPage.module.scss'

export const AddPlantPage = () => {
  //const queryClient = useQueryClient()
  const [successMassageVisible, setSuccesMesageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<null | string>(null)
  const [createCategory, setCreateCategory] = useState(false)
  const addPlant = trpc.addPlant.useMutation()
  const { data, isLoading, isError, isFetching, error } = trpc.getCategories.useQuery()

  const formik = useFormik({
    initialValues: {
      genus: '',
      species: '',
      description: '',
      categoryId: '',
      imageSrc: '',
    },
    validate: withZodSchema(zAddPlantTrpcInput),
    onSubmit: async (values) => {
      try {
        await addPlant.mutateAsync(values)
        formik.resetForm()
        //queryClient.invalidateQueries()
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
        <Button type="button" variant="outlined" color="secondary" onClick={onCreateCategoryButtonClick}>
          создать категорию
        </Button>
        <TextInput name="genus" lable="род" formik={formik} />
        <TextInput name="species" lable="вид" formik={formik} />
        <TextInput name="description" lable="описание" formik={formik} />
        <ImageInput name="imageSrc" formik={formik} />
        {formik.values.imageSrc && <img src={formik.values.imageSrc}></img>}

        {!formik.isValid && !!formik.submitCount && <Alert message="проверьте поля" color="red" />}
        {successMassageVisible && <Alert message="успешно" color="green" />}
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
