import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Button, Grid, Stack, Typography } from '@mui/material'

import { getCloudinaryUrl } from '../../lib/cloudinaryUrlGenerator'
import { PreviewCard } from '../Cards/PrewiewCard'

interface DataFromCards {
  name: string
  id: string
  description: string | null
  imagesUrl: string[]
  inventoryNumber?: string
  price?: string
  createdAt?: Date
}

export type TType = 'genus' | 'lifeForm' | 'variegation' | 'plant' | 'instance'

interface СardsCollection {
  title: string
  type: TType
  data: DataFromCards[]
  onCardClick: (id: string, type?: TType) => void
  onCardDelete: ((id: string, name: string, type?: TType) => void) | null
  onCardEdit?: (id: string) => void
  isFullView?: boolean
  togleIsFullView?: () => void
  wrapperStyle?: React.CSSProperties
}

export const CardsCollection = ({
  title,
  data,
  onCardClick,
  onCardDelete,
  onCardEdit,
  type,
  isFullView = true,
  togleIsFullView,
  wrapperStyle,
}: СardsCollection) => {
  return (
    <Stack sx={wrapperStyle}>
      <Grid container justifyContent="space-between">
        <Grid>
          <Typography variant="h3" gutterBottom>
            {title}
          </Typography>
        </Grid>
        {togleIsFullView && (
          <Grid>
            <Button
              sx={{ justifyContent: 'space-between', width: '150px' }}
              variant="text"
              onClick={togleIsFullView}
            >
              <ArrowDownwardIcon
                sx={{
                  transform:
                    (isFullView ? 'rotate(180deg)' : 'rotate(0deg)') + '!important',
                  transition: 'transform 0.5s ease',
                }}
              />
              {isFullView ? 'свернуть' : 'развернуть'}
            </Button>
          </Grid>
        )}
      </Grid>

      <Grid
        sx={!isFullView ? { flexWrap: 'nowrap', overflow: 'auto' } : null}
        container
        spacing={{ xs: 2, sm: 2.5, xl: 3 }}
      >
        {data.map((item) => {
          const imagesUrl = item.imagesUrl.map((url) =>
            getCloudinaryUrl(url, 'thumbnail'),
          )
          return (
            <Grid
              sx={!isFullView ? { flexShrink: 0 } : null}
              size={{ xs: 6, sm: 4, md: 3, lg: 2.4, xl: 2 }}
              key={item.id}
            >
              {type === 'instance' ? (
                <PreviewCard
                  type="instance"
                  onCardClick={() => onCardClick(item.id, type)}
                  onDeleteClick={
                    onCardDelete && (() => onCardDelete(item.id, item.name, type))
                  }
                  onEditClick={onCardEdit && (() => onCardEdit(item.id))}
                  imagesUrl={imagesUrl}
                  name={item.name}
                  description={item.description}
                  inventoryNumber={item.inventoryNumber || ''}
                  price={item.price || ''}
                  createdAt={item.createdAt}
                  key={item.id}
                />
              ) : (
                <PreviewCard
                  type="reference"
                  onCardClick={() => onCardClick(item.id, type)}
                  onDeleteClick={
                    onCardDelete && (() => onCardDelete(item.id, item.name, type))
                  }
                  onEditClick={onCardEdit && (() => onCardEdit(item.id))}
                  imagesUrl={imagesUrl}
                  name={item.name}
                  description={item.description}
                  key={item.id}
                />
              )}
            </Grid>
          )
        })}
      </Grid>
    </Stack>
  )
}
