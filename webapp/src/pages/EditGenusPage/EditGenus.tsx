import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { zEditGenusTrpcInput } from '@plants-project/backend/src/router/editGenus/input'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { Galery } from '../../components/Galery/Galery'
import { ImagesInput } from '../../components/ImagesInput/ImagesInput'
import { TextInput } from '../../components/TextInput/TextInput'
import { useGetUrlsFromCloudinary } from '../../hooks/useGetUrlsFromCloudinary'
import { useForm } from '../../lib/form'
import { EditGenusRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const EditGenusPage = () => {
  const editGenus = trpc.editGenus.useMutation()
  const [arrayFromImagesInput, setArrayFromImagesInput] = useState<File[] | null>(null)
  const imagesUrl = useGetUrlsFromCloudinary(arrayFromImagesInput)

  const { genusId } = useParams() as EditGenusRouteParams

  const { data, isLoading, isError, error } = trpc.getGenusById.useQuery({ genusId: genusId }, { enabled: !!genusId })

  useEffect(() => {
    if (imagesUrl) {
      const newImagesUrl = [...formik.values.imagesUrl, ...imagesUrl]
      void formik.setFieldValue('imagesUrl', newImagesUrl)
    }
  }, [imagesUrl])

  useEffect(() => {
    if (!data?.genus) {
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
      id: genusId,
      name: '',
      description: '',
      imagesUrl: [],
    },
    validationSchema: zEditGenusTrpcInput,
    onSubmit: async (values) => {
      await editGenus.mutateAsync(values)
    },
    successMessage: 'род обновлен',
    showValidationAlert: true,
    redirectOnSuccess: `/genus/${genusId}`,
  })

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5">Загрузка...</Typography>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5" color="error">
          Ошибка: {error?.message || 'Не удалось загрузить род'}
        </Typography>
      </Box>
    )
  }

  if (!data?.genus) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5">Род не найден</Typography>
      </Box>
    )
  }

  const initialisation = async () => {
    await formik.setValues({
      id: genusId,
      name: data.genus.name,
      description: data.genus.description || '',
      imagesUrl: data.genus.imagesUrl,
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
              <Typography variant="h2">Изменить род</Typography>
              <TextInput name="name" label="название" formik={formik} />
              <TextInput name="description" label="описание" formik={formik} />
              <ImagesInput name="imagesUrl" formik={formik} setFileArray={setArrayFromImagesInput} />
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
