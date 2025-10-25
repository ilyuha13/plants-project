import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { zAddPlantTrpcInput } from '@plants-project/backend/src/router/addPlant/input'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { Galery } from '../../components/Galery/Galery'
import { ImagesInput } from '../../components/ImagesInput/ImagesInput'
import { TextInput } from '../../components/TextInput/TextInput'
import { useForm } from '../../lib/form'
import { trpc } from '../../lib/trpc'

export const AddPlantPage = () => {
  const addPlant = trpc.addPlant.useMutation()

  const {
    formik,
    buttonProps,
    alertOptions: { hidden: alertHidden, ...alertProps },
  } = useForm({
    initialValues: {
      inventoryNumber: '',
      variety: '',
      genus: '',
      description: '',
      images: [],
      price: 0, // {TODO: не удобно приходиться удалять 0 если сделать пустую строку то ошибка - можно использовать regex /^\d+$/ как в inventoryNumber}
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
              <TextInput name="inventoryNumber" label="инвентарный номер" formik={formik} />
              <TextInput name="variety" label="сорт" formik={formik} />
              <TextInput name="genus" label="вид" formik={formik} />
              <TextInput name="description" label="описание" formik={formik} />
              <TextInput type="number" name="price" label="цена" formik={formik} />
              <ImagesInput name="images" formik={formik} />
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
