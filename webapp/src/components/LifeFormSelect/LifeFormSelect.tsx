import { Autocomplete, TextField } from '@mui/material'
import { FormikProps } from 'formik'

import { trpc } from '../../lib/trpc'

interface TLifeFormSelectProps<T> {
  name: keyof T & string
  label?: string
  formik: FormikProps<T>
  required?: boolean
}

export const LifeFormSelect = <T,>({
  name,
  label = 'Жизненная форма',
  formik,
  required = false,
}: TLifeFormSelectProps<T>) => {
  const { data, isLoading } = trpc.getLifeForm.useQuery()

  const lifeForm = data?.lifeForm || []
  const selectedLifeForm = lifeForm.find((lf) => lf.id === formik.values[name])

  const error = formik.errors[name]
  const errorMessage = typeof error === 'string' ? error : ''

  return (
    <Autocomplete
      options={lifeForm}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedLifeForm || null}
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
