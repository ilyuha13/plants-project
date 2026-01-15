import { Box, Button, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

import { DetailCard } from '../../../components/Cards/DetailCard'
import { DeleteDialog } from '../../../components/DeleteDialog'
import { useDialog } from '../../../hooks'
import { useMe } from '../../../lib/ctx'
import {
  getEditPlantInstanceRoute,
  getPlantDetailRoute,
  getPlantsListRoute,
  InstanceDetailRouteParams,
} from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import { useCartStore } from '../../../stores/cartStore'

export const InstanceDetailPage = () => {
  const { instanceId } = useParams() as InstanceDetailRouteParams
  const navigate = useNavigate()
  const confirmDeleteDialog = useDialog()

  const { data, isLoading, isError, error } = trpc.getPlantInstance.useQuery(
    { Id: instanceId },
    { enabled: !!instanceId },
  )
  const deleteInstance = trpc.deletePlantInstance.useMutation()
  const addToCart = trpc.addToCart.useMutation()
  const utils = trpc.useUtils()
  const openCart = useCartStore((state) => state.openCart)

  const me = useMe()
  const isAdmin = me?.role === 'ADMIN'

  const handleDeleteClick = () => {
    confirmDeleteDialog.open()
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteInstance.mutateAsync({ Id: instanceId })
      confirmDeleteDialog.close()
      void navigate(getPlantsListRoute())
    } catch (error) {
      console.error('Failed to delete instance:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!me) {
      console.error('User not authenticated')
      return
    }

    try {
      await addToCart.mutateAsync({ userId: me.id, plantInstanceId: instanceId })
      await utils.getCart.invalidate()
      await utils.getPlantInstance.invalidate()
      openCart()
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

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
          Ошибка: {error?.message || 'Не удалось загрузить экземпляр'}
        </Typography>
      </Box>
    )
  }

  if (!data?.instance) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5">Экземпляр не найден</Typography>
      </Box>
    )
  }

  const { plant, description, price, inventoryNumber, status, imagesUrl, createdAt } =
    data.instance
  const name = plant.name
  const plantId = plant.plantId

  const getAddButtonText = () => {
    if (status === 'IN_CART') {
      return 'В корзине'
    }
    if (status === 'SOLD') {
      return 'Продано'
    }
    return 'Добавить в корзину'
  }

  const navigateToEditInstance = () => {
    void navigate(getEditPlantInstanceRoute({ instanceId: instanceId }))
  }

  const navigateToPlant = () => {
    void navigate(getPlantDetailRoute({ plantId: plantId }))
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
        type="instance"
        name={name}
        imagesUrl={imagesUrl}
        description={description}
        price={price}
        inventoryNumber={isAdmin ? inventoryNumber : null}
        createdAt={createdAt}
        addButtonText={getAddButtonText()}
        onAddToCart={me ? handleAddToCart : undefined}
        onDeleteClick={isAdmin ? handleDeleteClick : null}
        onEditClick={isAdmin ? navigateToEditInstance : undefined}
      />

      <Button onClick={navigateToPlant} fullWidth sx={{ marginTop: 3 }}>
        ← Назад к сорту
      </Button>

      <DeleteDialog
        open={confirmDeleteDialog.isOpen}
        onClose={confirmDeleteDialog.close}
        onDelete={handleConfirmDelete}
        message={`Вы уверены что хотите удалить экземпляр #${inventoryNumber}? Это действие нельзя отменить.`}
      />
    </Box>
  )
}
