import { Box, Card, CardActionArea, Typography } from '@mui/material'

export const PlantCard = ({ title }: { title: string }) => {
  const isMobile = false
  return (
    <Card
      sx={{
        minWidth: '150px',
        maxwidth: isMobile ? '100%' : '320px',
      }}
    >
      <CardActionArea>
        <Box sx={{ bgcolor: 'primary.main', width: '100%', height: '70px' }}></Box>
        <Typography variant="h5">{title}</Typography>
      </CardActionArea>
    </Card>
  )
}
