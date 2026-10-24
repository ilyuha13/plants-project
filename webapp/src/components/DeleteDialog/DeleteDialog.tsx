import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleClose = () => {
    setErrorMessage(null)
    onClose()
  }

  const handleConfirm = async () => {
    setIsDeleting(true)
    setErrorMessage(null)
    try {
      await onDelete()
      handleClose()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Не удалось выполнить удаление',
      )
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <Dialog open={open} onClose={isDeleting ? undefined : handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isDeleting}>
          {cancelButtonText}
        </Button>
        <Button onClick={() => void handleConfirm()} color="error" disabled={isDeleting}>
          {isDeleting ? 'Удаление...' : confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
