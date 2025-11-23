import { Card, CardContent, CardMedia, Typography, CardActionArea, CardActions } from '@mui/material'

interface BaseCardProps {
  onClick?: () => void
}

type TPreviewCardProps = BaseCardProps & {
  name: string
  description: string | null
  imageUrl: string
  children?: React.ReactNode
}

export const PreviewCardLayout = ({ children, name, description, imageUrl, onClick }: TPreviewCardProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={onClick}>
        <CardMedia component="img" image={imageUrl} alt={name} sx={{ width: '100%', objectFit: 'cover' }} />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {name}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>{children}</CardActions>
    </Card>
  )
}
