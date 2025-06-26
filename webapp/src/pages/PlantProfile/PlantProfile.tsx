import { Box, Container, Grid, Paper } from '@mui/material'
//import { UseTRPCQueryResult } from '@trpc/react-query/shared'
import { useParams } from 'react-router-dom'
import { env } from '../../lib/env'
import { TplantProfileRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import css from './PlantProfile.module.scss'
//import { TrpcRouterOutput } from '@plants-project/backend/src/router'

// const whithPageWrapper = <TQueryResult extends UseTRPCQueryResult>({ Component, useQuery }: { Component: React.FC; useQuery: TQueryResult }) => {
//   const queryResult = useQuery()
//   return () => (
//     <Container maxWidth="sm" sx={{ bgcolor: 'background.default' }}>
//       <Component />
//     </Container>
//   )
// }

export const PlantProfile = () => {
  const { plantId } = useParams() as TplantProfileRouteParams
  const { data, error, isError, isFetching, isLoading } = trpc.getPlant.useQuery({ plantId })
  const imageUrl = data && `${env.VITE_BACKEND_URL}/${data.plant.imageUrl.replace('public/', '')}`
  if (isLoading || isFetching) {
    return <span>loading...</span>
  }

  if (isError) {
    return <span>error: {error.message}</span>
  }

  if (!data?.plant) {
    return <span>plant not found</span>
  }
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#fe8fc' }}>
        <Paper elevation={3} sx={{ width: '90%', height: '80vh' }}>
          <Box sx={{}}>
            <Grid container spacing={3}>
              <Grid container spacing={3} size={8}>
                <Grid size={4}>
                  <Box sx={{ backgroundColor: 'blue' }}>1</Box>
                </Grid>
                <Grid size={8}>
                  <Box sx={{ backgroundColor: 'blue' }}>
                    <img className={css.image} src={imageUrl} alt="image" />
                  </Box>
                </Grid>
                <Grid size={12}>
                  <Box sx={{ backgroundColor: 'blue' }}>3</Box>
                </Grid>
              </Grid>
              <Grid size={4}>
                <Box sx={{ backgroundColor: 'blue' }}>4</Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
