import { FormikProps } from 'formik'
import { useState } from 'react'
import { ImageInput } from '../ImageInput/ImageInput'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ImagesInput = ({ formik, arrayName }: { formik: FormikProps<any>; arrayName: string }) => {
  const [photoNumber, setPhotoNumber] = useState(0)

  const incrementPhotoNumber = () => {
    setPhotoNumber(photoNumber + 1)
  }
  return (
    <div onChange={incrementPhotoNumber}>
      <ImageInput name={`${arrayName}[${photoNumber}]`} formik={formik} />
    </div>
  )
}
