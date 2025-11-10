import TextField from '@mui/material/TextField'
import { FormikProps, getIn } from 'formik'

// Рекурсивный тип для поддержки вложенных путей (например "contactInfo.name")
type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends object
    ? K | `${K}.${NestedKeyOf<T[K]>}`
    : K
}[keyof T & string]

interface TTextInput<T> {
  label: string
  name: NestedKeyOf<T>  // ✅ Поддерживает вложенные пути
  formik: FormikProps<T>
  type?: 'text' | 'password' | 'number'
}

export const TextInput = <T,>({ type = 'text', formik, label, name }: TTextInput<T>) => {
  // getIn возвращает any, поэтому явно типизируем
  const value = getIn(formik.values, name) as string | undefined
  const error = getIn(formik.errors, name) as string | undefined
  const touched = getIn(formik.touched, name) as boolean | undefined
  const disabled = formik.isSubmitting
  const invalid = !!touched && !!error

  return (
    <TextField
      error={invalid}
      helperText={invalid ? error : undefined}
      disabled={disabled}
      label={label}
      type={type}
      id={name}
      name={name}
      value={value ?? ''}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      color="secondary"
      fullWidth
    />
  )
}
