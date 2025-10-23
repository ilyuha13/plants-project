import { Button } from '@mui/material'
import { FormikProps } from 'formik'
import { Alert } from '../Alert/Alert'

export const ImagesInput = ({
  name,
  formik,
}: {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>
}) => {
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const invalid = !!touched && !!error
  return (
    <Button component="label" variant="outlined" sx={{ width: 200 }}>
      <input
        hidden
        multiple
        onChange={(e) => {
          if (e.target.files) {
            const files = e.target.files
            const fileArray = Array.from(files)
            const imageUrls: string[] = []
            fileArray.forEach((file) => {
              const reader = new FileReader()
              reader.readAsDataURL(file)
              reader.onload = () => {
                if (reader.result) {
                  imageUrls.push(reader.result as string)
                  if (imageUrls.length === fileArray.length) {
                    formik.setFieldValue(name, imageUrls)
                  }
                }
              }
            })
          }
        }}
        onFocus={() => {
          formik.setFieldTouched(name, false)
        }}
        onBlur={() => {
          formik.setFieldTouched(name)
        }}
        type="file"
      />
      добавить фото
      {invalid && <Alert type="error" children={error} />}
    </Button>
  )
}
