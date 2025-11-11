import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { zAddPlantTrpcInput } from '@plants-project/backend/src/router/addPlant/input'
import { useEffect, useState } from 'react'

import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { Galery } from '../../components/Galery/Galery'
import { ImagesInput } from '../../components/ImagesInput/ImagesInput'
import { TextInput } from '../../components/TextInput/TextInput'
import { readFileArrayAsDataUrl } from '../../lib/fileReader'
import { useForm } from '../../lib/form'
import { trpc } from '../../lib/trpc'

export const AddPlantPage = () => {
  const addPlant = trpc.addPlant.useMutation()
  const [arrayFromImagesInput, setArrayFromImagesInput] = useState<File[] | null>(null)

  useEffect(() => {
    if (!arrayFromImagesInput) {
      return
    }
    const loadImages = async () => {
      try {
        const imageUrls = await readFileArrayAsDataUrl(arrayFromImagesInput)
        await formik.setFieldValue('images', imageUrls)
      } catch (error) {
        console.error('Failed to read files:', error)
      }
    }

    void loadImages()
  }, [arrayFromImagesInput])

  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
      name: '',
      description: '',
      images: [],
    },
    validationSchema: zAddPlantTrpcInput,
    onSubmit: async (values) => {
      await addPlant.mutateAsync(values)
    },
    successMessage: 'растение добавленно',
    showValidationAlert: true,
    resetOnSuccess: true,
  })

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
              <Typography variant="h2">Добавить растение</Typography>
              <TextInput name="name" label="название" formik={formik} />
              <TextInput name="description" label="описание" formik={formik} />
              <ImagesInput name="images" formik={formik} setFileArray={setArrayFromImagesInput} />
              <Button {...buttonProps}>отправить</Button>
              {!alertHidden && <Alert {...alertProps} />}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Galery imageUrls={formik.values.images} alt="addedImage" />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
