import { Button } from '@mui/material'
import { FormikProps } from 'formik'
//import { useState } from 'react'
import { Alert } from '../Alert/Alert'

export const ImageInput = ({
  name,
  formik,
  shouldLoadImage,
  afterLoadImage,
}: {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>
  shouldLoadImage?: (imageName: string) => boolean
  afterLoadImage?: () => void
}) => {
  const error = formik.errors[name] as string | undefined
  const reader = new FileReader()
  const touched = formik.touched[name]
  const invalid = !!touched && !!error
  //const [imageUrl, setImageUrl] = useState('')
  return (
    <Button component="label" variant="outlined" color="secondary">
      <input
        onChange={(e) => {
          if (e.target.files) {
            const imgFile = e.target.files[0]
            if (shouldLoadImage && !shouldLoadImage(imgFile.name)) {
              return
            }

            reader.readAsDataURL(imgFile)
            reader.onload = () => {
              const readerResult = reader.result

              formik.setFieldValue(name, { src: readerResult, name: imgFile.name })

              afterLoadImage?.()

              // setImageUrl(readerResult as string)
            }
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
      {/* {imageUrl && <img src={} alt="image" />} */}
      upload image
      {invalid && <Alert type="error" children={error} />}
    </Button>
  )
}
