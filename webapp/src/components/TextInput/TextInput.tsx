import TextField from '@mui/material/TextField'
import { FormikProps } from 'formik'
type TTextInput = {
  lable: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>
  type?: 'text' | 'password' | 'number'
}

export const TextInput = ({ type = 'text', formik, lable, name }: TTextInput) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const disabled = formik.isSubmitting
  const invalid = !!touched && !!error
  return (
    <TextField
      error={invalid}
      disabled={disabled}
      label={lable}
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      color="secondary"
    />
  )
}
