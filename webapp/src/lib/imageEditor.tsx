import { Dialog, DialogActions, DialogContent } from '@mui/material'
import { useDialogs, DialogProps } from '@toolpad/core/useDialogs'
import { useRef, useState } from 'react'
import { Button } from '../components/Button/Button'
import { ImageEditor } from '../components/ImageEditor/ImageEditor'

export const useImageEditor = ({
  image,
  // setImage,
}: {
  image: { src: string; name: string } | null
  // setImage: React.Dispatch<
  //   React.SetStateAction<{
  //     src: string
  //     name: string
  //   } | null>
  //>
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dialogs = useDialogs()
  const dialogRef = useRef<Promise<void>>(null)
  const imageEditorDialog = ({ open, onClose }: DialogProps) => {
    if (!image) {
      return
    }
    return (
      <Dialog fullWidth open={open} onClose={() => onClose()}>
        <DialogContent>
          <ImageEditor
            // onSaved={() => {
            //   onClose()
            // }}
            // setImage={setImage}
            image={image}
          />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => onClose()}>
            закрыть
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  const imageEditor = {
    open: () => {
      setIsOpen(true)

      dialogRef.current = dialogs.open(imageEditorDialog, undefined, {
        onClose: async () => {
          setIsOpen(false)
        },
      })
    },
    close: () => {
      if (dialogRef.current) {
        dialogs.close(dialogRef.current, undefined)
      }
    },
    isOpen,
  }
  return imageEditor
}
