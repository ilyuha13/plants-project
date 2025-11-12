import { Box, ImageList, ImageListItem, Stack } from '@mui/material'
import { useState } from 'react'

import { getCloudinaryUrl } from '../../lib/cloudinaryUrlGenerator'

export const Galery = ({ imageUrls, alt }: { imageUrls: string[]; alt: string }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const cloudinaryUrls: { mediumUrl: string; smallUrl: string }[] = []
  imageUrls.map((iamgeId) => {
    const { mediumUrl, smallUrl } = getCloudinaryUrl(iamgeId)
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
    </Stack>
  )
}
