import cn from 'classnames'
import { FormikProps } from 'formik'
import s from './textInput.module.scss'
type TTextInput = {
  lable: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>
  type?: 'text' | 'password'
}

export const TextInput = ({ type = 'text', ...p }: TTextInput) => {
  const value = p.formik.values[p.name]
  const error = p.formik.errors[p.name] as string | undefined
  const touched = p.formik.touched[p.name]
  const disabled = p.formik.isSubmitting
  const invalid = !!touched && !!error
  return (
    <div className={cn({ [s.container]: true, [s.disabled]: disabled })}>
      <label className={s.label} htmlFor={p.name}>
        {p.lable}
      </label>
      <input
        type={type}
        onChange={(e) => {
          p.formik.setFieldValue(p.name, e.target.value)
        }}
        onBlur={() => {
          p.formik.setFieldTouched(p.name)
        }}
        onFocus={() => {
          p.formik.setFieldTouched(p.name, false)
        }}
        value={value}
        name={p.name}
        id={p.name}
        disabled={disabled}
        className={cn({ [s.input]: true, [s.invalid]: invalid })}
      />
      {invalid && <div className={s.error}>{error}</div>}
    </div>
  )
}
