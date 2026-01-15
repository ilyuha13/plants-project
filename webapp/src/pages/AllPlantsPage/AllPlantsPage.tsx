import { Box } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CardsCollection } from '../../components/CardsCollection/CardsCollection'
import { DeleteDialog } from '../../components/DeleteDialog'
import { useDialog } from '../../hooks'
import { useMe } from '../../lib/ctx'
import { getEditPlantRoute, getPlantDetailRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const AllPlantsPage = () => {
  const me = useMe()
  const isAdmin = me?.role === 'ADMIN'

  const { data, isLoading, isError, error } = trpc.getPlants.useQuery()
  const deletePlant = trpc.deletePlant.useMutation()

  const [currentDeleteData, setCurrentDeleteData] = useState<{
    id: string
    name: string
  }>()

  const confirmDeleteDialog = useDialog()

  const handleDeleteInstance = () => {
    confirmDeleteDialog.open()
  }

  const handleConfirmDelete = async () => {
    await deletePlant.mutateAsync({ plantId: currentDeleteData!.id })
    confirmDeleteDialog.close()
  }

  const handleDeleteClick = (id: string, name: string) => {
    setCurrentDeleteData({ id, name })
    handleDeleteInstance()
  }

  const navigate = useNavigate()

  const navigateToPlantDetail = (plantId: string) => {
    void navigate(getPlantDetailRoute({ plantId }))
  }
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error: {error.message}</div>
  }
  if (!data?.plants.length) {
    return <div>No instances found.</div>
  }

  const navigateToEditPlant = (plantId: string) => {
    void navigate(getEditPlantRoute({ plantId }))
  }

  return (
    <Box>
      <CardsCollection
        type="plant"
        title="Все растения"
        data={data.plants}
        isFullView={true}
        onCardClick={navigateToPlantDetail}
        onCardDelete={isAdmin ? handleDeleteClick : null}
        onCardEdit={isAdmin ? navigateToEditPlant : undefined}
      />
      <DeleteDialog
        open={confirmDeleteDialog.isOpen}
        onClose={confirmDeleteDialog.close}
        onDelete={handleConfirmDelete}
        message={`Вы уверены что хотите удалить все растения сорта ${currentDeleteData?.name} ? Это действие нельзя отменить.`}
      />
    </Box>
  )
}
