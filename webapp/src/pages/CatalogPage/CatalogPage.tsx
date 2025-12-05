import { Divider, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CardsCollection, TType } from '../../components/CardsCollection/CardsCollection'
import { DeleteDialog } from '../../components/DeleteDialog'
import { useDialog } from '../../hooks'
import { useReferences } from '../../hooks/useReferences'
import { useMe } from '../../lib/ctx'
import { getGenusDetailRoute, getLifeFormDetailRoute, getVariegationDetailRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const CatalogPage = () => {
  const navigate = useNavigate()
  const { genus, variegation, lifeForm, error, isError, isLoading } = useReferences()
  const deleteGenus = trpc.deleteGenus.useMutation()
  const deleteLifeForm = trpc.deleteLifeForm.useMutation()
  const deleteVariegation = trpc.deleteVariegation.useMutation()
  const [currentDeleteData, setCurrentDeleteData] = useState<{
    type: 'genus' | 'lifeForm' | 'variegation'
    id: string
    name: string
  }>()
  const [isFullViewGenusGalery, setIsFullViewGenusGalery] = useState<boolean>(false)
  const [isFullViewVariegationGalery, setIsFullViewVariegationGalery] = useState<boolean>(false)
  const [isFullViewLifeFormGalery, setIsFullViewLifeFormGalery] = useState<boolean>(false)

  const togleIsFullViewGenusGalery = () => {
    setIsFullViewGenusGalery(!isFullViewGenusGalery)
  }
  const togleIsFullViewVariegationGalery = () => {
    setIsFullViewVariegationGalery(!isFullViewVariegationGalery)
  }
  const togleIsFullViewLifeFormGalery = () => {
    setIsFullViewLifeFormGalery(!isFullViewLifeFormGalery)
  }

  const confirmDeleteDialog = useDialog()

  const me = useMe()
  const isAdmin = me?.role === 'ADMIN'

  if (isLoading) {
    return <span>loading...</span>
  }

  if (isError) {
    if (!error) {
      return <span>references loading error</span>
    } else {
      return <span>error: {error.message}</span>
    }
  }

  const handleDeleteClick = () => {
    confirmDeleteDialog.open()
  }

  const handleConfirmDelete = async () => {
    try {
      switch (currentDeleteData?.type) {
        case 'genus':
          await deleteGenus.mutateAsync({ genusId: currentDeleteData.id })
          break

        case 'lifeForm':
          await deleteLifeForm.mutateAsync({ lifeFormId: currentDeleteData.id })
          break

        case 'variegation':
          await deleteVariegation.mutateAsync({ variegationId: currentDeleteData.id })
          break
      }
      confirmDeleteDialog.close()
    } catch (error) {
      console.error(`Failed to delete ${currentDeleteData?.type}:`, error)
    }
  }

  const navigateToReference = (id: string, type?: TType) => {
    switch (type) {
      case 'genus':
        void navigate(getGenusDetailRoute({ genusId: id }))
        break
      case 'variegation':
        void navigate(getVariegationDetailRoute({ variegationId: id }))
        break
      case 'lifeForm':
        void navigate(getLifeFormDetailRoute({ lifeFormId: id }))
        break
    }
  }

  const deleteReference = (id: string, name: string, type?: TType) => {
    switch (type) {
      case 'genus':
        setCurrentDeleteData({ id, name, type })
        break
      case 'variegation':
        setCurrentDeleteData({ type, id, name })
        break
      case 'lifeForm':
        setCurrentDeleteData({ type, id, name })
        break
    }
    void handleDeleteClick()
  }

  const getReferenceTypeName = (): string => {
    switch (currentDeleteData?.type) {
      case 'genus':
        return 'род'
      case 'lifeForm':
        return 'жизненную форму'
      case 'variegation':
        return 'вариегатность'
    }
    return ''
  }

  return (
    <>
      <Stack>
        <Typography variant="h2" gutterBottom>
          Каталог растений
        </Typography>
        <Typography variant="h2" gutterBottom>
          Каталог растений
        </Typography>
        <Divider />
        <CardsCollection
          isFullView={isFullViewGenusGalery}
          togleIsFullView={togleIsFullViewGenusGalery}
          onCardDelete={isAdmin ? deleteReference : null}
          onCardClick={navigateToReference}
          data={genus}
          title="Род"
          type="genus"
        />
        <Divider />
        <CardsCollection
          isFullView={isFullViewVariegationGalery}
          togleIsFullView={togleIsFullViewVariegationGalery}
          onCardDelete={isAdmin ? deleteReference : null}
          onCardClick={navigateToReference}
          data={variegation}
          title="Расцветка"
          type="variegation"
        />
        <Divider />
        <CardsCollection
          isFullView={isFullViewLifeFormGalery}
          togleIsFullView={togleIsFullViewLifeFormGalery}
          onCardDelete={isAdmin ? deleteReference : null}
          onCardClick={navigateToReference}
          data={lifeForm}
          title="Тип роста"
          type="lifeForm"
        />
      </Stack>
      <DeleteDialog
        open={confirmDeleteDialog.isOpen}
        onClose={confirmDeleteDialog.close}
        onDelete={handleConfirmDelete}
        message={`Вы уверены что хотите удалить "${getReferenceTypeName()} ${currentDeleteData?.name}"? Это действие нельзя отменить.`}
      />
    </>
  )
}
