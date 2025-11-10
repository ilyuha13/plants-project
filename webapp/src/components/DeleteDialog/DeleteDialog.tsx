import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useState } from 'react'

interface DeleteDialogProps {
  open: boolean
  onClose: () => void
  onDelete: () => Promise<void>
  title?: string
  message: string
  confirmButtonText?: string
  cancelButtonText?: string
}

export const DeleteDialog = ({
  open,
  title = 'подтвердите удаление',
  message,
  onClose,
  onDelete,
  confirmButtonText = 'Удалить',
  cancelButtonText = 'Отмена',
}: DeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
      onClose()
    } catch (error) {
      console.error('Deleting failed:', error)
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <Dialog open={open} onClose={isDeleting ? undefined : onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          {cancelButtonText}
        </Button>
        <Button onClick={() => void handleConfirm()} color="error" disabled={isDeleting}>
          {isDeleting ? 'Удаление...' : confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
