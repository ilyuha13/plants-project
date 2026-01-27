import { Autocomplete, TextField } from '@mui/material'
import { FormikProps } from 'formik'

import { trpc } from '../../lib/trpc'

interface TPlantSelectProps<T> {
  name: keyof T & string
  label?: string
  formik: FormikProps<T>
  required?: boolean
}

export const PlantSelect = <T,>({
  name,
  label = 'Растение',
  formik,
  required = false,
}: TPlantSelectProps<T>) => {
  const { data, isLoading } = trpc.getPlants.useQuery()

  const plants = data?.plants || []
  const selectedPlant = plants.find((plant) => plant.id === formik.values[name])

  const error = formik.errors[name]
  const errorMessage = typeof error === 'string' ? error : ''

  return (
    <Autocomplete
      options={plants}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedPlant || null}
      loading={isLoading}
      onChange={(_, newValue) => {
        void formik.setFieldValue(name, newValue?.id || '')
      }}
      onBlur={formik.handleBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          required={required}
          error={formik.touched[name] && Boolean(formik.errors[name])}
          helperText={formik.touched[name] ? errorMessage : ''}
        />
      )}
    />
  )
}
