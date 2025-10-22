import { Box, ImageList, ImageListItem, Paper, Typography } from '@mui/material'
import { zAddPlantInstanceTrpcInput } from '@plants-project/backend/src/router/addPlantInstance/input'
import { useEffect, useState } from 'react'
import { SpeciesSelector } from '../../components/SpeciesSelector/SpeciesSelector'
import { env } from '../../lib/env'
import { useForm } from '../../lib/form'
import { trpc } from '../../lib/trpc'

export const AddPlantPage = () => {
  const addPlant = trpc.addPlantInstance.useMutation()
  const [species, setSpecies] = useState<{
    description: string
    imagesUrl: string[]
    name: string
    lifeForm: string
    variability: string
    speciesId: string
  } | null>(null)

  useEffect(() => {
    if (!species) {
      return
    }
    formik.setFieldValue('speciesId', species.speciesId)
  }, [species])

  const { formik } = useForm({
    initialValues: {
      description: '',
      images: [],
      price: 0,
      speciesId: '',
    },
    validationSchema: zAddPlantInstanceTrpcInput,
    onSubmit: async (values) => {
      await addPlant.mutateAsync(values)
    },
    successMessage: 'растение добавленно',
    showValidationAlert: true,
    resetOnSuccess: true,
  })

  // if (isLoading || isFetching) {
  //   return <span>loading...</span>
  // }

  // const onSelectSpeciesButtonCllick = () => {
  //   setShowSpeciesSelector(true)
  // }

  return (
    <Box>
      {!species ? (
        <SpeciesSelector setSpecies={setSpecies} />
      ) : (
        <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          {species.imagesUrl[0] ? (
            <ImageList sx={{ width: 200, height: 600 }} cols={1} variant="quilted" rowHeight={200} gap={5}>
              {species.imagesUrl.map((imageUrl, index) => {
                imageUrl = `${env.VITE_BACKEND_URL}/${imageUrl.replace('public/', '')}`
                return (
                  <ImageListItem key={index}>
                    <img
                      style={{ borderRadius: '8px' }}
                      srcSet={imageUrl}
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      loading="lazy"
                    />
                  </ImageListItem>
                )
              })}
            </ImageList>
          ) : (
            <img
              src={`${env.VITE_BACKEND_URL}/images/logo.jpg`}
              alt="No images"
              style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
            />
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ width: '400px', textAlign: 'center', marginBottom: '10px' }}>
              {species.description ?? 'Описание не указано'}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  )
}
