import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ReferenceDetailCard } from '../../components/Cards/ReferenceDetailCard'
import { DeleteDialog } from '../../components/DeleteDialog'
import { ReferenceCarousel } from '../../components/ReferenceCarousel/ReferenceCarousel'
import { useDialog } from '../../hooks'
import { useMe } from '../../lib/ctx'
import { getPlantDetailRoute, VariegationDatailRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const VariegationDetailPage = () => {
  const { variegationId } = useParams() as VariegationDatailRouteParams
  const navigate = useNavigate()

  const [currentDeleteData, setCurrentDeleteData] = useState<{
    type: 'variegation' | 'plant'
    id: string
    name: string
  }>({ type: 'variegation', id: variegationId, name: 'any' })

  const { data, isLoading, isError, error } = trpc.getVariegationById.useQuery(
    { variegationId: variegationId },
    { enabled: !!variegationId },
  )
  const deleteVariegation = trpc.deleteVariegation.useMutation()
  const deletePlant = trpc.deletePlant.useMutation()
  const confirmDeleteDialog = useDialog()
  const trpcUtils = trpc.useUtils()

  const me = useMe()
  const isAdmin = me?.role === 'ADMIN'

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5">Загрузка...</Typography>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5" color="error">
          Ошибка: {error?.message || 'Не удалось загрузить вариегатность'}
        </Typography>
      </Box>
    )
  }

  if (!data?.variegation) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5">Вариегатность не найдена</Typography>
      </Box>
    )
  }

  const { name, description, imagesUrl } = data.variegation

  const plants = data.variegation.plants.map(({ plantId, ...rest }) => ({
    ...rest,
    id: plantId,
  }))

  const handleDeleteClick = () => {
    confirmDeleteDialog.open()
  }

  const handleConfirmDelete = async () => {
    try {
      switch (currentDeleteData.type) {
        case 'variegation':
          await deleteVariegation.mutateAsync({ variegationId: variegationId })
          confirmDeleteDialog.close()
          void navigate(-1)
          break
        case 'plant':
          await deletePlant.mutateAsync({ plantId: currentDeleteData.id })
          await trpcUtils.getVariegationById.invalidate()
          confirmDeleteDialog.close()
          setCurrentDeleteData({ type: 'variegation', id: variegationId, name: 'any' })
          break
      }
    } catch (error) {
      console.error('Failed to delete variegation:', error)
    }
  }

  const onDeletePlantClick = (id: string, name: string) => {
    setCurrentDeleteData({ type: 'plant', id, name })
    handleDeleteClick()
  }

  const getDeleteMassage = (): string => {
    switch (currentDeleteData.type) {
      case 'variegation':
        return `вариегатность: ${name}`
      case 'plant':
        return `все растения вида/сорта: ${currentDeleteData.name}`
    }
  }

  const navigateToPlant = (id: string) => {
    void navigate(getPlantDetailRoute({ plantId: id }))
  }

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: { xs: 2, sm: 3, md: 4 },
        minHeight: '80vh',
      }}
    >
      <ReferenceDetailCard
        name={name}
        description={description}
        imagesUrl={imagesUrl}
        showDeleteButton={isAdmin}
        onDelete={handleDeleteClick}
        deleteButtonLoading={deleteVariegation.isPending}
      />

      <Button onClick={() => void navigate(-1)} fullWidth sx={{ marginTop: 3 }}>
        ← Назад
      </Button>

      {plants && plants.length > 0 && (
        <Box marginTop={3}>
          <ReferenceCarousel
            data={plants}
            title={`растения c расцветкой ${name}`}
            type="plant"
            showDeleteButton={isAdmin}
            onCardClick={navigateToPlant}
            onCardDelete={onDeletePlantClick}
          />
        </Box>
      )}

      <DeleteDialog
        open={confirmDeleteDialog.isOpen}
        onClose={confirmDeleteDialog.close}
        onDelete={handleConfirmDelete}
        message={`Вы уверены что хотите удалить "${getDeleteMassage()}"? Это действие нельзя отменить.`}
      />
    </Box>
  )
}
