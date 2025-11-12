import { Button, Stack } from '@mui/material'
import { FormikProps } from 'formik'

import { Alert } from '../Alert/Alert'

export const ImagesInput = ({
  name,
  formik,
  setFileArray,
}: {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>
  setFileArray: React.Dispatch<React.SetStateAction<File[] | null>>
}) => {
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const invalid = !!touched && !!error
  return (
    <Stack spacing={2} sx={{ mb: 2 }}>
      <Button component="label" variant="outlined" sx={{ width: 200 }}>
        <input
          hidden
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setFileArray(null)
              const files = e.target.files
              const fileArray = Array.from(files)
              setFileArray(fileArray)
              e.target.files = null
            }
          }}
          onFocus={() => {
            void formik.setFieldTouched(name, false)
          }}
          onBlur={() => {
            void formik.setFieldTouched(name)
          }}
          type="file"
        />
        добавить фото
      </Button>
      {invalid && <Alert type="error" children={error} />}
    </Stack>
  )
}
