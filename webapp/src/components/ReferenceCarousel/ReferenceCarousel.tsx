import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'

import { ReferencePreviewCard } from '../Cards/ReferencePreviewCard'

interface Reference {
  name: string
  id: string
  description: string | null
  imagesUrl: string[]
}

export type TType = 'genus' | 'lifeForm' | 'variegation' | 'plant'

interface TReferenceCarousel {
  showDeleteButton: boolean
  title: string
  type: TType
  data: Reference[]
  onCardClick: (id: string, type?: TType) => void
  onCardDelete: (id: string, name: string, type?: TType) => void
}

export const ReferenceCarousel = ({
  title,
  data,
  onCardClick,
  onCardDelete,
  showDeleteButton,
  type,
}: TReferenceCarousel) => {
  const [isFullView, setIsFullView] = useState<boolean>(true)

  const togleIsFullView = () => {
    setIsFullView(!isFullView)
  }
  return (
    <Stack>
      <Grid container justifyContent="space-between">
        <Grid>
          <Typography variant="h3" gutterBottom>
            {title}
          </Typography>
        </Grid>
        <Grid>
          <Button sx={{ justifyContent: 'space-between', width: '150px' }} variant="text" onClick={togleIsFullView}>
            <ArrowDownwardIcon
              sx={{
                transform: (!isFullView ? 'rotate(180deg)' : 'rotate(0deg)') + '!important',
                transition: 'transform 0.5s ease',
              }}
            />
            {!isFullView ? 'свернуть' : 'развернуть'}
          </Button>
        </Grid>
      </Grid>

      <Grid
        sx={isFullView ? { flexWrap: 'nowrap', overflow: 'auto' } : null}
        container
        spacing={{ xs: 2, sm: 2.5, xl: 3 }}
      >
        {data.map((item) => {
          return (
            <Grid
              sx={isFullView ? { flexShrink: 0 } : null}
              size={{ xs: 6, sm: 4, md: 3, lg: 2.4, xl: 2 }}
              key={item.id}
            >
              <ReferencePreviewCard
                data={item}
                showDeleteButton={showDeleteButton}
                onClick={() => onCardClick(item.id, type)}
                onDelete={() => onCardDelete(item.id, item.name, type)}
              />
            </Grid>
          )
        })}
      </Grid>
    </Stack>
  )
}
