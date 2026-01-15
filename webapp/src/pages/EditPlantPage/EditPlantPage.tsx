import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { zEditPlantTrpcInput } from '@plants-project/backend/src/router/editPlant/input'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { Galery } from '../../components/Galery/Galery'
import { ImagesInput } from '../../components/ImagesInput/ImagesInput'
import { LifeFormSelect } from '../../components/LifeFormSelect/LifeFormSelect'
import { TextInput } from '../../components/TextInput/TextInput'
import { VariegationSelect } from '../../components/VariegationSelect/VariegationSelect'
import { GenusSelect } from '../../components/genusSelect/genusSelect'
import { useGetUrlsFromCloudinary } from '../../hooks/useGetUrlsFromCloudinary'
import { useForm } from '../../lib/form'
import { PlantDetailRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const EditPlantPage = () => {
  const editPlant = trpc.editPlant.useMutation()
  const [arrayFromImagesInput, setArrayFromImagesInput] = useState<File[] | null>(null)
  const imagesUrl = useGetUrlsFromCloudinary(arrayFromImagesInput)

  const { plantId } = useParams() as PlantDetailRouteParams

  const { data, isLoading, isError, error } = trpc.getPlant.useQuery(
    { plantId: plantId },
    { enabled: !!plantId },
  )

  useEffect(() => {
    if (!data?.plant) {
      return
    }

    void initialisation()
  }, [data])

  useEffect(() => {
    if (imagesUrl) {
      const newImagesUrl = [...formik.values.imagesUrl, ...imagesUrl]
      void formik.setFieldValue('imagesUrl', newImagesUrl)
    }
  }, [imagesUrl])

  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
      id: plantId,
      genusId: '',
      variegationId: '',
      lifeFormId: '',
      name: '',
      description: '',
      imagesUrl: [],
    },
    validationSchema: zEditPlantTrpcInput,
    onSubmit: async (values) => {
      await editPlant.mutateAsync(values)
    },
    successMessage: 'растение обновлено',
    showValidationAlert: true,
    redirectOnSuccess: `/plants/${plantId}`,
  })

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5">Загрузка...</Typography>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5" color="error">
          Ошибка: {error?.message || 'Не удалось загрузить растение'}
        </Typography>
      </Box>
    )
  }

  if (!data?.plant) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5">Растение не найдено</Typography>
      </Box>
    )
  }

  const initialisation = async () => {
    if (!data?.plant) {
      return
    }
    await formik.setValues({
      id: plantId,
      genusId: data.plant.genusId,
      variegationId: data.plant.variegationId,
      lifeFormId: data.plant.lifeFormId,
      name: data.plant.name,
      description: data.plant.description || '',
      imagesUrl: data.plant.imagesUrl,
    })
  }

  const onSetBaseImageClick = (imageIndex: number) => {
    if (imageIndex === undefined) {
      return
    }
    const imagesUrl = [...formik.values.imagesUrl]
    if (imagesUrl.length <= 1) {
      return
    }
    const baseImage = imagesUrl[imageIndex]
    imagesUrl.splice(imageIndex, 1)
    imagesUrl.unshift(baseImage)
    void formik.setFieldValue('imagesUrl', imagesUrl)
  }

  const onRemoveImageClick = (imageIndex: number) => {
    if (imageIndex === undefined) {
      return
    }
    const imagesUrl = formik.values.imagesUrl
    imagesUrl.splice(imageIndex, 1)
    void formik.setFieldValue('imagesUrl', imagesUrl)
  }
  return (
    <Box>
      <Paper
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          minHeight: '70vh',
        }}
      >
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack component="form" onSubmit={formik.handleSubmit} sx={{ p: 2 }}>
              <Typography variant="h2">Обновить растение</Typography>
              <GenusSelect name="genusId" label="род" formik={formik} />
              <VariegationSelect
                name="variegationId"
                label="вариегатность"
                formik={formik}
              />
              <LifeFormSelect name="lifeFormId" label="жизненная форма" formik={formik} />
              <TextInput name="name" label="название" formik={formik} />
              <TextInput name="description" label="описание" formik={formik} />
              <ImagesInput
                name="imagesUrl"
                formik={formik}
                setFileArray={setArrayFromImagesInput}
              />
              <Button {...buttonProps}>отправить</Button>
              {!alertHidden && <Alert {...alertProps} />}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Galery
              imageUrls={formik.values.imagesUrl}
              alt="addedImage"
              setBaseImage={onSetBaseImageClick}
              removeImage={onRemoveImageClick}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
