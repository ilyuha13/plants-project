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
  getEditPlantInstanceRoute,
  getEditPlantRoute,
  getInstanceDetailRoute,
  PlantDetailRouteParams,
} from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const PlantDetailPage = () => {
  const { plantId } = useParams() as PlantDetailRouteParams
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = trpc.getPlant.useQuery(
    { plantId: plantId },
    { enabled: !!plantId },
  )
  const deletePlant = trpc.deletePlant.useMutation()
  const deleteInstance = trpc.deletePlantInstance.useMutation()
  const trpcUtils = trpc.useUtils()

  const addToCart = trpc.addToCart.useMutation()

  const [currentDeleteData, setCurrentDeleteData] = useState<{
    type: 'instance' | 'plant'
    id: string
    inventoryNumber: string
  }>({ type: 'plant', id: plantId, inventoryNumber: '' })
  const confirmDeleteDialog = useDialog()

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
          Ошибка: {error?.message || 'Не удалось загрузить растение'}
        </Typography>
      </Box>
    )
  }

  if (!data?.plant) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5">Растение не найдено</Typography>
      </Box>
    )
  }

  const instances = data.plant.plantInstances.map(({ Id, ...rest }) => ({
    ...rest,
    id: Id,
    name: data.plant.name,
  }))

  const onDeleteInstanceClick = (id: string, inventoryNumber: string) => {
    setCurrentDeleteData({ type: 'instance', id, inventoryNumber })
    handleDeleteClick()
  }

  const handleDeleteClick = () => {
    confirmDeleteDialog.open()
  }

  const handleConfirmDelete = async () => {
    try {
      switch (currentDeleteData.type) {
        case 'plant':
          await deletePlant.mutateAsync({ plantId })
          confirmDeleteDialog.close()
          void navigate(getCatalogPageRoute())
          break
        case 'instance':
          await deleteInstance.mutateAsync({ Id: currentDeleteData.id })
          await trpcUtils.getPlant.invalidate()
          confirmDeleteDialog.close()
          setCurrentDeleteData({ type: 'plant', id: plantId, inventoryNumber: '' })
      }
    } catch (error) {
      console.error('Failed to delete plant:', error)
    }
  }

  const { name, description, imagesUrl } = data.plant

  const getDeleteMassage = (): string => {
    switch (currentDeleteData.type) {
      case 'plant':
        return `все растения вида/сорта: ${name}`
      case 'instance':
        return `экземпляр вида/сорта ${name}: №: ${currentDeleteData.inventoryNumber}`
    }
  }

  const navigateToEditPlantPage = () => {
    void navigate(getEditPlantRoute({ plantId }))
  }

  const navigateToEditPlantInstance = (id: string) => {
    void navigate(getEditPlantInstanceRoute({ instanceId: id }))
  }

  const navigateToPlantInstance = (id: string) => {
    void navigate(getInstanceDetailRoute({ instanceId: id }))
  }

  const onDeletePlantInstanceClick = (id: string, inventoryNumber: string) => {
    onDeleteInstanceClick(id, inventoryNumber)
  }

  const navigateToCatalog = () => {
    void navigate(getCatalogPageRoute())
  }

  const handleAddToCart = async (instanceId: string) => {
    if (!me) {
      console.error('User not authenticated')
      return
    }

    try {
      await addToCart.mutateAsync({ userId: me.id, plantInstanceId: instanceId })
      await trpcUtils.getCart.invalidate()
      await trpcUtils.getPlantInstance.invalidate()
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
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
        onDeleteClick={handleDeleteClick}
        onEditClick={navigateToEditPlantPage}
      />

      <Button onClick={navigateToCatalog} fullWidth sx={{ marginTop: 3 }}>
        ← Назад к каталогу
      </Button>

      {instances && instances.length > 0 && (
        <Box marginTop={3}>
          <CardsCollection
            type="instance"
            onCardEdit={isAdmin ? navigateToEditPlantInstance : undefined}
            data={instances}
            title={`растения рода ${name}`}
            onCardClick={navigateToPlantInstance}
            onCardDelete={isAdmin ? onDeletePlantInstanceClick : null}
            onAddToCart={handleAddToCart}
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
