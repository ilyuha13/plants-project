import { Box } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CardsCollection } from '../../components/CardsCollection/CardsCollection'
import { DeleteDialog } from '../../components/DeleteDialog'
import { useDialog } from '../../hooks'
import { useMe } from '../../lib/ctx'
import { getEditPlantInstanceRoute, getInstanceDetailRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const AllInstancePage = () => {
  const me = useMe()
  const isAdmin = me?.role === 'ADMIN'

  const { data, isLoading, isError, error } = trpc.getAllInstances.useQuery()
  const deleteInstance = trpc.deletePlantInstance.useMutation()

  const addToCart = trpc.addToCart.useMutation()

  const trpcUtils = trpc.useUtils()

  const [currentDeleteData, setCurrentDeleteData] = useState<{
    id: string
    name: string
    inventoryNumber: string
  }>()

  const confirmDeleteDialog = useDialog()

  const handleDeleteInstance = () => {
    confirmDeleteDialog.open()
  }

  const handleConfirmDelete = async () => {
    await deleteInstance.mutateAsync({ id: currentDeleteData!.id })
    confirmDeleteDialog.close()
  }

  const handleDeleteClick = (id: string, name: string, inventoryNumber?: string) => {
    if (!inventoryNumber) {
      return
    }
    setCurrentDeleteData({ id, name, inventoryNumber })
    handleDeleteInstance()
  }

  const navigate = useNavigate()

  const navigateToInsatnceDetail = (instanceId: string) => {
    void navigate(getInstanceDetailRoute({ instanceId }))
  }
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error: {error.message}</div>
  }
  if (!data?.instances.length) {
    return <div>No instances found.</div>
  }

  const navigateToEditPlantInstance = (instanceId: string) => {
    void navigate(getEditPlantInstanceRoute({ instanceId }))
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
      await trpcUtils.getAllInstances.invalidate()
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const instances = data.instances.map(({ inventoryNumber, price, ...rest }) => ({
    price: String(price),
    ...rest,
    ...(isAdmin && { inventoryNumber }),
  }))

  return (
    <Box>
      <CardsCollection
        type="instance"
        title={`Все экземпляры${data.instances.length > 0 ? ` (${data.instances.length})` : ''}`}
        data={instances}
        isFullView={true}
        onCardClick={navigateToInsatnceDetail}
        onCardDelete={isAdmin ? handleDeleteClick : null}
        onCardEdit={isAdmin ? navigateToEditPlantInstance : undefined}
        onAddToCart={me ? handleAddToCart : undefined}
      />
      <DeleteDialog
        open={confirmDeleteDialog.isOpen}
        onClose={confirmDeleteDialog.close}
        onDelete={handleConfirmDelete}
        message={`Вы уверены что хотите удалить экземпляр сорта ${currentDeleteData?.name} номер: ${currentDeleteData?.inventoryNumber}? Это действие нельзя отменить.`}
      />
    </Box>
  )
}
