import { Autocomplete, TextField } from '@mui/material'
import { FormikProps } from 'formik'

import { trpc } from '../../lib/trpc'

interface TVariegationSelectProps<T> {
  name: keyof T & string
  label?: string
  formik: FormikProps<T>
  required?: boolean
}

export const VariegationSelect = <T,>({
  name,
  label = 'Вариегатность',
  formik,
  required = false,
}: TVariegationSelectProps<T>) => {
  const { data, isLoading } = trpc.getVariegation.useQuery()

  const variegation = data?.variegation || []
  const selectedVariegation = variegation.find((v) => v.id === formik.values[name])

  const error = formik.errors[name]
  const errorMessage = typeof error === 'string' ? error : ''

  return (
    <Autocomplete
      options={variegation}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedVariegation || null}
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
