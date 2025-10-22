import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormikProps } from 'formik'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { ImageEditor } from '../ImageEditor/ImageEditor'
import { ImageInput } from '../imageInput2/ImageInput2'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ImagesInputWithCrop = ({ formik, call }: { formik: FormikProps<any>; call: boolean }) => {
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<{ src: string; name: string } | null>(null)
  const [onCroped, setOnCroped] = useState(false)
  const [onSaved, setOnSaved] = useState(false)
  const [callImageInput, setCallImageInput] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (call) {
      setCallImageInput(true)
    }
    if (!call) {
      setCallImageInput(false)
    }
  }, [call])

  useEffect(() => {
    if (!image) {
      return
    }
    if (onSaved) {
      formik.setFieldValue(`images[${formik.values.images.length}]`, { src: image.src, name: image.name })
      setOnSaved(false)
      return
    }

    handleClickOpen()
  }, [image])

  useEffect(() => {
    if (!onCroped) {
      return
    }
    if (!image) {
      return
    }
    if (!onSaved) {
      return
    }
    setOpen(false)
    setOnCroped(false)
  }, [onSaved])

  useEffect(() => {}, [open])
  return (
    <React.Fragment>
      <ImageInput setImage={setImage} call={callImageInput} />
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Добавить фото</DialogTitle>
        <DialogContent>
          <ImageEditor image={image!} onCroped={onCroped} onSaved={onSaved} setImage={setImage} />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => handleClose()}>
            закрыть
          </Button>
          <Button
            type="button"
            onClick={() => {
              setOnCroped(true)
            }}
          >
            обрезать
          </Button>
          <Button
            type="button"
            onClick={() => {
              setOnCroped(false)
            }}
          >
            отменить
          </Button>
          <Button
            type="button"
            onClick={() => {
              setOnSaved(true)
            }}
          >
            сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
