import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
  Grid,
  Typography,
} from '@mui/material'
//import { useEffect, useState } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import { env } from '../../lib/env'
import { getAddSpeciesPageRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import { Button } from '../Button/Button'

export const SpeciesSelector = ({
  setSpecies,
  // openSpeciesSelector,
}: {
  setSpecies: React.Dispatch<
    React.SetStateAction<{
      name: string
      description: string
      speciesId: string
      lifeForm: string
      variability: string
      imagesUrl: string[]
    } | null>
  >
  //openSpeciesSelector?: boolean
}) => {
  const { data, error, isError, isFetching, isLoading } = trpc.getSpecies.useQuery()

  // const handleClickOpen = () => {
  //   setOpen(true)
  // }

  // const handleClose = () => {
  //   setOpen(false)
  // }

  // useEffect(() => {
  //   if (openSpeciesSelector) {
  //     setOpen(true)
  //   }
  //   if (!openSpeciesSelector) {
  //     setOpen(false)
  //   }
  // }, [openSpeciesSelector])

  if (isLoading || isFetching) {
    return <span>loading...</span>
  }
  if (isError) {
    return <span>error: {error.message}</span>
  }

  return (
    <React.Fragment>
      {/* <Button type="button" onClick={handleClickOpen}>
        Выбрать сорт
      </Button> */}
      {/* <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Выберите сорт</DialogTitle>
        <DialogContent> */}
      <h1>Выберите сорт</h1>
      <Grid container spacing={2}>
        {data?.species.map((species) => {
          const imageUrl = `${env.VITE_BACKEND_URL}/${species.imagesUrl[0].replace('public/', '')}`
          return (
            <Grid key={species.speciesId} size={{ xs: 2, sm: 4, md: 4 }}>
              <Card sx={{ maxHeight: 200, maxWidth: 200 }}>
                <CardActionArea
                  onClick={() => {
                    setSpecies(species)
                    //handleClose()
                  }}
                >
                  <CardMedia
                    sx={{ height: 140 }}
                    image={imageUrl || 'https://via.placeholder.com/150'}
                    title={species.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {species.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
      </Grid>
      <Link to={getAddSpeciesPageRoute()}>
        <Button type="button">добавить новый сорт</Button>
      </Link>
      {/* </DialogContent>
        <DialogActions>
          <Link to={getAddSpeciesPageRoute()}>
            <Button type="button">добавить новый сорт</Button>
          </Link>
        </DialogActions>
      </Dialog> */}
    </React.Fragment>
  )
}
