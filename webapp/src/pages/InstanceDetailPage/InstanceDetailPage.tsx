import { Box, Button, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

import { PlantInstanceDetailCard } from '../../components/Cards/PlantInstanceDetailCard'
import { DeleteDialog } from '../../components/DeleteDialog'
import { useDialog } from '../../hooks'
import { useMe } from '../../lib/ctx'
import { env } from '../../lib/env'
import { getPlantsListRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const InstanceDetailPage = () => {
  const { instanceId } = useParams<string>()
  const navigate = useNavigate()
  const confirmDeleteDialog = useDialog()

  const { data, isLoading, isError, error } = trpc.getPlantInstance.useQuery(
    { Id: instanceId! },
    { enabled: !!instanceId },
  )
  const deleteInstance = trpc.deletePlantInstance.useMutation()
  const addToCart = trpc.addToCart.useMutation()
  const utils = trpc.useUtils()

  const me = useMe()

  const handleDeleteClick = () => {
    confirmDeleteDialog.open()
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteInstance.mutateAsync({ Id: instanceId! })
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
      await addToCart.mutateAsync({ userId: me.id, plantInstanceId: instanceId! })
      await utils.getCart.invalidate()
      await utils.getPlantInstance.invalidate()
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

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
          Ошибка: {error?.message || 'Не удалось загрузить экземпляр'}
        </Typography>
      </Box>
    )
  }

  if (!data?.instance) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h5">Экземпляр не найден</Typography>
      </Box>
    )
  }

  const imageUrls: string[] = []
  data.instance.imagesUrl.map((imageUrl) => {
    imageUrls.push(`${env.VITE_BACKEND_URL}/${imageUrl.replace('public/', '')}`)
  })

  const { plant, description, price, inventoryNumber, status } = data.instance
  const name = plant.name

  // Показываем кнопку только авторизованным пользователям
  const showAddButton = !!me
  const showDeleteButton = me?.role === 'ADMIN'

  // Определяем текст кнопки на основе статуса
  const getAddButtonText = () => {
    if (status === 'IN_CART') {
      return 'В корзине'
    }
    if (status === 'SOLD') {
      return 'Продано'
    }
    return 'Добавить в корзину'
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
      <PlantInstanceDetailCard
        name={name}
        imageUrls={imageUrls}
        description={description}
        price={price}
        inventoryNumber={inventoryNumber}
        showAddButton={showAddButton}
        addButtonText={getAddButtonText()}
        addButtonLoading={addToCart.isPending}
        onAddToCart={handleAddToCart}
        showDeleteButton={showDeleteButton}
        deleteButtonLoading={deleteInstance.isPending}
        onDelete={handleDeleteClick}
      />

      <Button onClick={() => void navigate(-1)} fullWidth sx={{ marginTop: 3 }}>
        ← Назад к каталогу
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
