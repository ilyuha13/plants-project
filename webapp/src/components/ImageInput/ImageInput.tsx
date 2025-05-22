import { Button } from '@mui/material'
import { FormikProps } from 'formik'
//import { useState } from 'react'
import { Alert } from '../Alert/Alert'
import css from './imageInput.module.scss'

export const ImageInput = ({
  name,
  formik,
}: {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>
}) => {
  const error = formik.errors[name] as string | undefined
  const reader = new FileReader()
  //const [imageUrl, setImageUrl] = useState('')
  return (
    <Button className={css.button} component="label" variant="outlined" color="secondary">
      <input
        onChange={(e) => {
          if (e.target.files) {
            const imgFile = e.target.files[0]
            reader.readAsDataURL(imgFile)
            reader.onload = () => {
              const readerResult = reader.result
              formik.setFieldValue(name, readerResult)
              // setImageUrl(readerResult as string)
            }
          }
        }}
        className={css.hidenInput}
        type="file"
      />
      {/* {imageUrl && <img src={} alt="image" />} */}
      upload image
      {error && <Alert color="red" message={error} />}
    </Button>
  )
}
