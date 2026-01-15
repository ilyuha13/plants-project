import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { zEditVariegationTrpcInput } from '@plants-project/backend/src/router/editVariegation/input'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { Galery } from '../../components/Galery/Galery'
import { ImagesInput } from '../../components/ImagesInput/ImagesInput'
import { TextInput } from '../../components/TextInput/TextInput'
import { useGetUrlsFromCloudinary } from '../../hooks/useGetUrlsFromCloudinary'
import { useForm } from '../../lib/form'
import { VariegationDatailRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const EditVariegationPage = () => {
  const editVariegation = trpc.editVariegation.useMutation()
  const [arrayFromImagesInput, setArrayFromImagesInput] = useState<File[] | null>(null)
  const imagesUrl = useGetUrlsFromCloudinary(arrayFromImagesInput)

  const { variegationId } = useParams() as VariegationDatailRouteParams

  const { data, isLoading, isError, error } = trpc.getVariegationById.useQuery(
    { variegationId: variegationId },
    { enabled: !!variegationId },
  )

  useEffect(() => {
    if (imagesUrl) {
      const newImagesUrl = [...formik.values.imagesUrl, ...imagesUrl]
      void formik.setFieldValue('imagesUrl', newImagesUrl)
    }
  }, [imagesUrl])

  useEffect(() => {
    if (!data?.variegation) {
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
      id: variegationId,
      name: '',
      description: '',
      imagesUrl: [],
    },
    validationSchema: zEditVariegationTrpcInput,
    onSubmit: async (values) => {
      await editVariegation.mutateAsync(values)
    },
    successMessage: 'вариегатность обновлена',
    showValidationAlert: true,
    redirectOnSuccess: `/variegation/${variegationId}`,
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
          Ошибка: {error?.message || 'Не удалось загрузить вариегатность'}
        </Typography>
      </Box>
    )
  }

  if (!data?.variegation) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5">Вариегатность не найдена</Typography>
      </Box>
    )
  }

  const initialisation = async () => {
    await formik.setValues({
      id: variegationId,
      name: data.variegation.name,
      description: data.variegation.description || '',
      imagesUrl: data.variegation.imagesUrl,
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
              <Typography variant="h2">Изменить вариегатность</Typography>
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
