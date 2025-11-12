import { Grid, Paper, Stack } from '@mui/material'

import { Galery } from '../../Galery/Galery'

interface DetailLayoutProps {
  imagesUrl: string[]
  imageAlt: string
  children: React.ReactNode
}

export const DetailLayout = ({ imagesUrl, imageAlt, children }: DetailLayoutProps) => {
  return (
    <Paper
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        minHeight: '70vh',
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Galery imageUrls={imagesUrl} alt={imageAlt} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack sx={{ height: '100%' }}>{children}</Stack>
        </Grid>
      </Grid>
    </Paper>
  )
}
