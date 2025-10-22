import { Box, Paper, Stack, Typography } from '@mui/material'
import { zAddSpeciesTrpcInput } from '@plants-project/backend/src/router/addSpecies/input'
import { useEffect, useRef, useState } from 'react'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
//import { ImagesInputWithCrop } from '../../components/ImagesInputWithCrop/ImagesInputWithCrop'
import { TextInput } from '../../components/TextInput/TextInput'
import { env } from '../../lib/env'
import { createObjectURLsForFiles, revokeObjectURLs } from '../../lib/fileReader'
import { useForm } from '../../lib/form'
import { trpc } from '../../lib/trpc'

export const AddSpeciesPage = () => {
  const addSpecies = trpc.addSpecies.useMutation()
  //const [callImageInputWihthCrop, setCallImageInputWithCrop] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [imagePreviews, setImagePreviews] = useState<Array<{ url: string; file: File }>>([])

  // Очистка временных URL при изменении imagePreviews и размонтировании компонента
  useEffect(() => {
    return () => {
      revokeObjectURLs(imagePreviews)
    }
  }, [imagePreviews])

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
    validationSchema: zAddSpeciesTrpcInput,
    onSubmit: async (values) => {
      await addSpecies.mutateAsync(values)
    },
    successMessage: 'растение добавленно',
    showValidationAlert: true,
    resetOnSuccess: true,
  })

  return (
    <Box>
      {/* <ImagesInputWithCrop call={callImageInputWihthCrop} formik={formik} /> */}

      <Paper
        elevation={3}
        sx={{
          width: '100%',
          height: '80vh',
          display: 'flex',
          flexDirection: 'row',
          gap: '5px',
          justifyContent: 'space-around',
        }}
      >
        <Box
          sx={{
            width: '70%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', height: '70%', width: '70%' }}>
            <Paper elevation={2} sx={{ width: 'auto', height: 'auto' }}>
              <img
                style={{ display: 'block', height: '100%', borderRadius: '8px', padding: '2px' }}
                srcSet={imagePreviews[0]?.url}
                src={imagePreviews[0]?.url ?? `${env.VITE_BACKEND_URL}/images/logo.jpg`}
                alt={'general image'}
                loading="lazy"
              />
            </Paper>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              overflowX: 'auto',
              height: '30%',
              width: '100%',
              padding: '10px',
            }}
          >
            {imagePreviews.map((preview, index) => (
              <Paper key={index} elevation={2} sx={{ height: '100%' }}>
                <img
                  style={{
                    objectFit: 'cover',
                    borderRadius: '5px',
                    padding: '2px',
                    height: '100%',
                    width: 'auto',
                  }}
                  srcSet={preview.url}
                  src={preview.url}
                  alt={`Image ${index + 1}`}
                  loading="lazy"
                />
              </Paper>
            ))}

            <Paper elevation={2}>
              <img
                onClick={() => imageInputRef.current?.click()}
                src={`${env.VITE_BACKEND_URL}/images/logo.jpg`}
                alt="No images"
                style={{ height: '70%', borderRadius: '8px', padding: '5px', cursor: 'pointer' }}
              />
              <Typography sx={{ height: '30%' }} variant="subtitle2" color="text.secondary">
                добавить фото
              </Typography>
            </Paper>
          </Stack>
        </Box>

        <Box
          sx={{
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '10px',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              formik.handleSubmit()
            }}
          >
            <Typography variant="h5">Добавим растение</Typography>
            <TextInput name="name" lable="название" formik={formik} />
            <TextInput name="description" lable="описание" formik={formik} />
            <input
              hidden
              name="images"
              type="file"
              multiple
              onChange={(e) => {
                const files = e.target.files
                if (!files) {
                  return
                }
                const fileArray = Array.from(files)

                // Создаем временные URL для превью
                const previews = createObjectURLsForFiles(fileArray)
                setImagePreviews(previews)

                // Сохраняем файлы в formik
                formik.setFieldValue('images', fileArray)
              }}
              ref={imageInputRef}
            />

            {!alertHidden && <Alert {...alertProps} />}
          </form>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button {...buttonProps}>Добавить</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
