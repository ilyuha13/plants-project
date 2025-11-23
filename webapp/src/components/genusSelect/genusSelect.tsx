import { Autocomplete, TextField } from '@mui/material'
import { FormikProps } from 'formik'

import { trpc } from '../../lib/trpc'

interface TPlantSelectProps<T> {
  name: keyof T & string
  label?: string
  formik: FormikProps<T>
  required?: boolean
}

export const GenusSelect = <T,>({ name, label = 'Род', formik, required = false }: TPlantSelectProps<T>) => {
  const { data, isLoading } = trpc.getGenus.useQuery()

  const genus = data?.genus || []
  const selectedGenus = genus.find((genus) => genus.id === formik.values[name])

  const error = formik.errors[name]
  const errorMessage = typeof error === 'string' ? error : ''

  return (
    <Autocomplete
      options={genus}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedGenus || null}
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
