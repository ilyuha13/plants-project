import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { DetailCard } from '../../../components/Cards/DetailCard'
import { CardsCollection } from '../../../components/CardsCollection/CardsCollection'
import { DeleteDialog } from '../../../components/DeleteDialog'
import { useDialog } from '../../../hooks'
import { useMe } from '../../../lib/ctx'
import {
  getCatalogPageRoute,
  getEditLifeFormRoute,
  getEditPlantRoute,
  getPlantDetailRoute,
  LifeFormDetailRouteParams,
} from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const LifeFormDetailPage = () => {
  const { lifeFormId } = useParams() as LifeFormDetailRouteParams
  const navigate = useNavigate()
  if (!lifeFormId) {
    return
  }

  const { data, isLoading, isError, error } = trpc.getLifeFormById.useQuery(
    { lifeFormId: lifeFormId },
    { enabled: !!lifeFormId },
  )
  const deleteLifeForm = trpc.deleteLifeForm.useMutation()
  const deletePlant = trpc.deletePlant.useMutation()
  const trpcUtils = trpc.useUtils()
  const confirmDeleteDialog = useDialog()
  const [currentDeleteData, setCurrentDeleteData] = useState<{
    type: 'lifeForm' | 'plant'
    id: string
    name: string
  }>({ type: 'lifeForm', id: lifeFormId, name: 'any' })

  const me = useMe()
  const isAdmin = me?.role === 'ADMIN'

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5">Загрузка...</Typography>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5" color="error">
          Ошибка: {error?.message || 'Не удалось загрузить жизненную форму'}
        </Typography>
      </Box>
    )
  }

  if (!data?.lifeForm) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5">Жизненная форма не найдена</Typography>
      </Box>
    )
  }

  const handleDeleteClick = () => {
    confirmDeleteDialog.open()
  }

  const handleConfirmDelete = async () => {
    try {
      switch (currentDeleteData.type) {
        case 'lifeForm':
          await deleteLifeForm.mutateAsync({ lifeFormId: lifeFormId })
          confirmDeleteDialog.close()
          void navigate(-1)
          break
        case 'plant':
          await deletePlant.mutateAsync({ plantId: currentDeleteData.id })
          await trpcUtils.getGenusById.invalidate()
          confirmDeleteDialog.close()
          setCurrentDeleteData({ type: 'lifeForm', id: lifeFormId, name: 'any' })
          break
      }
    } catch (error) {
      console.error('Failed to delete life form:', error)
    }
  }

  const { name, description, imagesUrl } = data.lifeForm

  const plants = data.lifeForm.plants.map(({ plantId, ...rest }) => ({
    ...rest,
    id: plantId,
  }))

  const navigateToPlant = (id: string) => {
    void navigate(getPlantDetailRoute({ plantId: id }))
  }

  const onDeletePlantClick = (id: string, name: string) => {
    setCurrentDeleteData({ type: 'plant', id, name })
    handleDeleteClick()
  }

  const getDeleteMassage = (): string => {
    switch (currentDeleteData.type) {
      case 'lifeForm':
        return `жизненную форму: ${name}`
      case 'plant':
        return `все растения вида/сорта: ${currentDeleteData.name}`
    }
  }

  const navigateToEditLifeForm = () => {
    void navigate(getEditLifeFormRoute({ lifeFormId: lifeFormId }))
  }

  const navigateToEditPlant = (id: string) => {
    void navigate(getEditPlantRoute({ plantId: id }))
  }

  const navigateToCatalog = () => {
    void navigate(getCatalogPageRoute())
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
      <DetailCard
        type="reference"
        name={name}
        description={description}
        imagesUrl={imagesUrl}
        onDeleteClick={isAdmin ? handleDeleteClick : null}
        onEditClick={isAdmin ? navigateToEditLifeForm : undefined}
      />

      <Button onClick={navigateToCatalog} fullWidth sx={{ marginTop: 3 }}>
        ← Назад
      </Button>

      {plants && plants.length > 0 && (
        <Box marginTop={3}>
          <CardsCollection
            data={plants}
            title={`растения с типом роста ${name}`}
            type="plant"
            onCardClick={navigateToPlant}
            onCardDelete={isAdmin ? onDeletePlantClick : null}
            onCardEdit={isAdmin ? navigateToEditPlant : undefined}
          />
        </Box>
      )}

      <DeleteDialog
        open={confirmDeleteDialog.isOpen}
        onClose={confirmDeleteDialog.close}
        onDelete={handleConfirmDelete}
        message={`Вы уверены что хотите удалить  "${getDeleteMassage()}"? Это действие нельзя отменить.`}
      />
    </Box>
  )
}
