import { Box, Button, ImageList, ImageListItem, Stack } from '@mui/material'
import { useState } from 'react'

import { getCloudinaryUrl } from '../../lib/cloudinaryUrlGenerator'

interface GaleryProps {
  imageUrls: string[]
  alt: string
  setBaseImage?: (imageIndex: number) => void
  removeImage?: (imageIndex: number) => void
}

export const Galery = ({ imageUrls, alt, setBaseImage, removeImage }: GaleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const cloudinaryUrls: { mediumUrl: string; smallUrl: string }[] = []
  imageUrls.map((iamgeId) => {
    const smallUrl = getCloudinaryUrl(iamgeId, 'small')
    const mediumUrl = getCloudinaryUrl(iamgeId, 'medium')
    cloudinaryUrls.push({ mediumUrl, smallUrl })
  })
  return (
    <Stack>
      {/* Главное изображение */}
      {imageUrls.length > 0 && (
        <Box
          component="img"
          src={cloudinaryUrls[selectedImageIndex].mediumUrl}
          alt={`${alt} - фото ${selectedImageIndex + 1}`}
          sx={{
            width: '100%',
            borderRadius: 1,
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
          onClick={() => {
            // TODO: Открывать в полноэкранном режиме
          }}
        />
      )}

      {/* Миниатюры */}
      {imageUrls.length > 1 && (
        <ImageList
          cols={4}
          gap={8}
          sx={{
            padding: 2,
            margin: 0,
            overflow: 'hidden',
          }}
        >
          {cloudinaryUrls.map((urls, index) => (
            <ImageListItem
              key={urls.smallUrl}
              sx={{
                cursor: 'pointer',
                opacity: selectedImageIndex === index ? 1 : 0.6,
                border: selectedImageIndex === index ? 2 : 0,
                borderColor: 'primary.main',
                borderRadius: 1,
                overflow: 'hidden',
                transition: 'all 0.2s',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={urls.smallUrl}
                alt={`${alt} - миниатюра ${index + 1}`}
                loading="lazy"
                style={{
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
      <Box
        flex="1"
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
        justifyContent="space-between"
        sx={{ mt: 2 }}
      >
        {setBaseImage && imageUrls.length > 1 && (
          <Button
            onClick={() => {
              setBaseImage(selectedImageIndex)
            }}
          >
            Сделать главным
          </Button>
        )}
        {removeImage && (
          <Button
            color="error"
            onClick={() => {
              removeImage(selectedImageIndex)
              setSelectedImageIndex(0)
            }}
          >
            Удалить изображение
          </Button>
        )}
      </Box>
    </Stack>
  )
}
