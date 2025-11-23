import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { zAddVariegationTrpcInput } from '@plants-project/backend/src/router/addVariegation/input'
import { useEffect, useState } from 'react'

import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { Galery } from '../../components/Galery/Galery'
import { ImagesInput } from '../../components/ImagesInput/ImagesInput'
import { TextInput } from '../../components/TextInput/TextInput'
import { useGetUrlsFromCloudinary } from '../../hooks/useGetUrlsFromCloudinary'
import { useForm } from '../../lib/form'
import { trpc } from '../../lib/trpc'

export const AddVariegationPage = () => {
  const addVariegation = trpc.addVariegation.useMutation()
  const [arrayFromImagesInput, setArrayFromImagesInput] = useState<File[] | null>(null)
  const imagesUrl = useGetUrlsFromCloudinary(arrayFromImagesInput)

  useEffect(() => {
    if (imagesUrl) {
      void formik.setFieldValue('imagesUrl', imagesUrl)
    }
  }, [imagesUrl])

  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
      name: '',
      description: '',
      imagesUrl: [],
    },
    validationSchema: zAddVariegationTrpcInput,
    onSubmit: async (values) => {
      await addVariegation.mutateAsync(values)
    },
    successMessage: 'вариегатность добавлена',
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
              <Typography variant="h2">Добавить вариегатность</Typography>
              <TextInput name="name" label="название" formik={formik} />
              <TextInput name="description" label="описание" formik={formik} />
              <ImagesInput name="imagesUrl" formik={formik} setFileArray={setArrayFromImagesInput} />
              <Button {...buttonProps}>отправить</Button>
              {!alertHidden && <Alert {...alertProps} />}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Galery imageUrls={formik.values.imagesUrl} alt="addedImage" />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
