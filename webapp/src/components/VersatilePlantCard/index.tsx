import CloseIcon from '@mui/icons-material/Close'
import { Card, CardContent, CardMedia, Typography, Box, Modal, IconButton, Fade, Backdrop } from '@mui/material'
import React, { useState } from 'react'

// --- Типы ---
type CardType = 'instance' | 'variety' | 'species' | 'genus' | 'life-form' | 'variegation'

interface VersatilePlantCardProps {
  type: CardType
  name: string
  description: string
  images: string[]
  onTitleClick: () => void
  price?: number
  lifeForm?: string
  variegation?: string
  genus?: string
  species?: string
}

// --- Стили для модального окна (можно вынести) ---
const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1,
  maxWidth: '90vw',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
}

// --- Компонент ---
const VersatilePlantCard: React.FC<VersatilePlantCardProps> = ({
  type,
  name,
  description,
  images,
  onTitleClick,
  price,
  lifeForm,
  variegation,
  genus,
  species,
}) => {
  const [mainImage, setMainImage] = useState(images[0] || '')
  const [modalOpen, setModalOpen] = useState(false)

  const handleThumbnailHover = (image: string) => {
    setMainImage(image)
  }

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const renderDetails = () => {
    const detailsToShow: { label: string; value?: string }[] = []

    switch (type) {
      case 'variety':
        detailsToShow.push({ label: 'Genus', value: genus })
        detailsToShow.push({ label: 'Species', value: species })
        detailsToShow.push({ label: 'Life Form', value: lifeForm })
        detailsToShow.push({ label: 'Variegation', value: variegation })
        break
      case 'species':
        detailsToShow.push({ label: 'Genus', value: genus })
        detailsToShow.push({ label: 'Life Form', value: lifeForm })
        detailsToShow.push({ label: 'Variegation', value: variegation })
        break
    }

    const filteredDetails = detailsToShow.filter((detail) => detail.value)

    if (filteredDetails.length === 0) {
      return null
    }

    return (
      <Box sx={{ mt: 1.5 }}>
        {filteredDetails.map((detail) => (
          <Typography variant="body2" color="text.secondary" key={detail.label}>
            <strong>{detail.label}:</strong> {detail.value}
          </Typography>
        ))}
      </Box>
    )
  }

  return (
    <>
      <Card sx={{ width: 320, display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="300"
          image={mainImage}
          alt={`${name} main view`}
          onClick={openModal}
          sx={{ cursor: 'pointer', objectFit: 'cover' }}
        />
        {images.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              p: 0.5,
              flexWrap: 'wrap',
              backgroundColor: 'grey.100',
            }}
          >
            {images.map((imgUrl) => (
              <Box
                key={imgUrl}
                component="img"
                src={imgUrl}
                alt={`${name} thumbnail`}
                onMouseEnter={() => handleThumbnailHover(imgUrl)}
                onClick={openModal}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  cursor: 'pointer',
                  borderRadius: 1,
                  border: mainImage === imgUrl ? '2px solid' : '2px solid transparent',
                  borderColor: mainImage === imgUrl ? 'primary.main' : 'transparent',
                  transition: 'border-color 0.2s',
                }}
              />
            ))}
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            onClick={onTitleClick}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {description}
          </Typography>

          {renderDetails()}

          {type === 'instance' && price !== undefined && (
            <Typography variant="h6" color="success.main" sx={{ mt: 'auto', pt: 1 }}>
              {price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={modalOpen}>
          <Box sx={modalStyle}>
            <IconButton
              aria-label="close"
              onClick={closeModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={mainImage}
              alt="Full screen view"
              sx={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain' }}
            />
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

export default VersatilePlantCard
