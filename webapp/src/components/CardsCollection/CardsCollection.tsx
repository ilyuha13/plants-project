import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Button, Grid, Stack, Typography } from '@mui/material'

import { getCloudinaryUrl } from '../../lib/cloudinaryUrlGenerator'
import { PreviewCard } from '../Cards/shared/PrewiewCard'

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
  onCardDelete:
    | ((id: string, name: string, type?: TType, inventoryNumber?: string) => void)
    | null
  isFullView: boolean | null
  togleIsFullView?: () => void
  isAdmin?: boolean
  wrapperStyle?: React.CSSProperties
}

export const CardsCollection = ({
  isAdmin = false,
  title,
  data,
  onCardClick,
  onCardDelete,
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
          const imageUrl = getCloudinaryUrl(item.imagesUrl[0], 'thumbnail')

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
                    onCardDelete &&
                    (() =>
                      onCardDelete(item.id, item.name, undefined, item.inventoryNumber))
                  }
                  imageUrl={imageUrl}
                  name={item.name}
                  description={item.description}
                  inventoryNumber={isAdmin ? item.inventoryNumber : undefined}
                  price={item.price || null}
                  createdAt={item.createdAt || null}
                />
              ) : (
                <PreviewCard
                  type="reference"
                  onCardClick={() => onCardClick(item.id, type)}
                  onDeleteClick={
                    onCardDelete && (() => onCardDelete(item.id, item.name, type))
                  }
                  imageUrl={imageUrl}
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
