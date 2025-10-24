import { Box, Grid, ImageList, ImageListItem, Stack } from '@mui/material'
import { useState } from 'react'

export const Galery = ({ imageUrls, alt }: { imageUrls: string[]; alt: string }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Stack>
        {/* Главное изображение */}
        {imageUrls.length > 0 && (
          <Box
            component="img"
            src={imageUrls[selectedImageIndex]}
            alt={`${alt} - фото ${selectedImageIndex + 1}`}
            sx={{
              width: '100%',
              height: { xs: '300px', sm: '400px', md: '500px' },
              borderRadius: 1, // 1 * 8px = 8px (соответствует theme.shape.borderRadius)
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
              margin: 0,
              overflow: 'hidden',
            }}
          >
            {imageUrls.map((url, index) => (
              <ImageListItem
                key={url}
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
                  src={url}
                  alt={`${alt} - миниатюра ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Stack>
    </Grid>
  )
}
