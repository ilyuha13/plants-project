import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { DetailCard } from '../../../components/Cards/DetailCard'
import { CardsCollection } from '../../../components/CardsCollection/CardsCollection'
import { DeleteDialog } from '../../../components/DeleteDialog'
import { useDialog } from '../../../hooks'
import { useMe } from '../../../lib/ctx'
import {
  GenusDetailRouteParams,
  getCatalogPageRoute,
  getEditGenusRoute,
  getEditPlantRoute,
  getPlantDetailRoute,
} from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const GenusDetailPage = () => {
  const { genusId } = useParams() as GenusDetailRouteParams

  const navigate = useNavigate()

  const { data, isLoading, isError, error } = trpc.getGenusById.useQuery(
    { genusId: genusId },
    { enabled: !!genusId },
  )
  const deleteGenus = trpc.deleteGenus.useMutation()
  const deletePlant = trpc.deletePlant.useMutation()
  const trpcUtils = trpc.useUtils()
  const confirmDeleteDialog = useDialog()
  const [currentDeleteData, setCurrentDeleteData] = useState<{
    type: 'genus' | 'plant'
    id: string
    name: string
  }>({ type: 'genus', id: genusId, name: 'any' })

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
          Ошибка: {error?.message || 'Не удалось загрузить род'}
        </Typography>
      </Box>
    )
  }

  if (!data?.genus) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h5">Род не найден</Typography>
      </Box>
    )
  }

  const { name, description, imagesUrl } = data.genus

  const plants = data.genus.plants.map(({ plantId, ...rest }) => ({
    ...rest,
    id: plantId,
  }))

  const handleDeleteClick = () => {
    confirmDeleteDialog.open()
  }

  const handleConfirmDelete = async () => {
    try {
      switch (currentDeleteData.type) {
        case 'genus':
          await deleteGenus.mutateAsync({ genusId: genusId })
          confirmDeleteDialog.close()
          void navigate(-1)
          break
        case 'plant':
          await deletePlant.mutateAsync({ plantId: currentDeleteData.id })
          await trpcUtils.getGenusById.invalidate()
          confirmDeleteDialog.close()
          setCurrentDeleteData({ type: 'genus', id: genusId, name: 'any' })
          break
      }
    } catch (error) {
      console.error('Failed to delete genus:', error)
    }
  }

  const navigateToPlant = (id: string) => {
    void navigate(getPlantDetailRoute({ plantId: id }))
  }

  const onDeletePlantClick = (id: string, name: string) => {
    setCurrentDeleteData({ type: 'plant', id, name })
    handleDeleteClick()
  }

  const getDeleteMassage = (): string => {
    switch (currentDeleteData.type) {
      case 'genus':
        return `род: ${name}`
      case 'plant':
        return `все растения вида/сорта: ${currentDeleteData.name}`
    }
  }

  const navigateToEditPlant = (id: string) => {
    void navigate(getEditPlantRoute({ plantId: id }))
  }

  const navigateToEditGenus = (id: string) => {
    void navigate(getEditGenusRoute({ genusId: id }))
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
        onDeleteClick={handleDeleteClick}
        onEditClick={isAdmin ? () => navigateToEditGenus(genusId) : undefined}
      />

      <Button onClick={navigateToCatalog} fullWidth sx={{ marginTop: 3 }}>
        ← Назад
      </Button>

      {plants && plants.length > 0 && (
        <Box marginTop={3}>
          <CardsCollection
            onCardEdit={navigateToEditPlant}
            data={plants}
            title={`растения рода ${name}`}
            type="plant"
            onCardClick={navigateToPlant}
            onCardDelete={isAdmin ? onDeletePlantClick : null}
          />
        </Box>
      )}

      <DeleteDialog
        open={confirmDeleteDialog.isOpen}
        onClose={confirmDeleteDialog.close}
        onDelete={handleConfirmDelete}
        message={`Вы уверены что хотите удалить  ${getDeleteMassage()}"? Это действие нельзя отменить.`}
      />
    </Box>
  )
}
