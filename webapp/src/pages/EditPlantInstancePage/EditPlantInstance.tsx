import { Alert, Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { zEditPlantInstanceTrpcInput } from '@plants-project/backend/src/router/editPlantInstance/input'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Galery } from '../../components/Galery/Galery'
import { ImagesInput } from '../../components/ImagesInput/ImagesInput'
import { PlantSelect } from '../../components/PlantSelect/PlantSelect'
import { TextInput } from '../../components/TextInput/TextInput'
import { useGetUrlsFromCloudinary } from '../../hooks/useGetUrlsFromCloudinary'
import { useForm } from '../../lib/form'
import { EditPlantInstanceRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const EditPlantInstancePage = () => {
  const { instanceId } = useParams() as EditPlantInstanceRouteParams

  const { data, isLoading, isError, error } = trpc.getPlantInstance.useQuery(
    { Id: instanceId },
    { enabled: !!instanceId },
  )

  const editPlantInstance = trpc.editPlantInstance.useMutation()

  const [arrayFromImagesInput, setArrayFromImagesInput] = useState<File[] | null>(null)
  const imagesUrl = useGetUrlsFromCloudinary(arrayFromImagesInput)

  useEffect(() => {
    if (imagesUrl) {
      const newImagesUrl = [...formik.values.imagesUrl, ...imagesUrl]
      void formik.setFieldValue('imagesUrl', newImagesUrl)
    }
  }, [imagesUrl])

  useEffect(() => {
    if (!data?.instance) {
      return
    }
    void initialisation()
  }, [data])

  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
      instanceId: instanceId,
      plantId: '',
      inventoryNumber: '',
      description: '',
      imagesUrl: [],
      price: '',
    },
    validationSchema: zEditPlantInstanceTrpcInput,
    onSubmit: async (values) => {
      await editPlantInstance.mutateAsync(values)
    },
    successMessage: 'экземпляр обновлен',
    showValidationAlert: true,
    redirectOnSuccess: `/instances/${instanceId}`,
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
          Ошибка: {error?.message || 'Не удалось загрузить экземпляр растения'}
        </Typography>
      </Box>
    )
  }

  if (!data?.instance) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5">Экземпляр растения не найден</Typography>
      </Box>
    )
  }

  const initialisation = async () => {
    await formik.setValues({
      instanceId: data.instance.Id,
      description: data.instance.description || '',
      imagesUrl: data.instance.imagesUrl,
      inventoryNumber: data.instance.inventoryNumber,
      plantId: data.instance.plant.plantId,
      price: data.instance.price,
    })
  }

  const onSetBaseImageClick = (imageIndex: number) => {
    if (imageIndex === undefined) {
      return
    }
    const imagesUrl = formik.values.imagesUrl
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
              <Typography variant="h2">Изменить экземпляр растения</Typography>
              <PlantSelect name="plantId" label="Растение" formik={formik} />
              <TextInput
                name="inventoryNumber"
                label="Инвентарный номер"
                formik={formik}
              />
              <TextInput name="price" label="Цена (₽)" formik={formik} />
              <TextInput
                name="description"
                label="Описание (опционально)"
                formik={formik}
              />
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
