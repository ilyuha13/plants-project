import { Autocomplete, TextField } from '@mui/material'
import { FormikProps } from 'formik'
import { trpc } from '../../lib/trpc'

type TPlantSelectProps = {
  name: string
  label?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>
  required?: boolean
}

export const PlantSelect = ({ name, label = 'Растение', formik, required = false }: TPlantSelectProps) => {
  const { data, isLoading } = trpc.getPlants.useQuery()

  const plants = data?.plants || []
  const selectedPlant = plants.find((p) => p.plantId === formik.values[name])

  return (
    <Autocomplete
      options={plants}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.plantId}
      isOptionEqualToValue={(option, value) => option.plantId === value.plantId}
      value={selectedPlant || null}
      loading={isLoading}
      onChange={(_, newValue) => {
        formik.setFieldValue(name, newValue?.plantId || '')
      }}
      onBlur={formik.handleBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          required={required}
          error={formik.touched[name] && Boolean(formik.errors[name])}
          helperText={formik.touched[name] && formik.errors[name] ? String(formik.errors[name]) : ''}
        />
      )}
    />
  )
}
