import { Container } from '@mui/material'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { trpc } from '../../lib/trpc'

type TPlantProfile = {
  changeCurrentTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>
  currentTheme: 'light' | 'dark'
}

export const PlantProfile: FC<TPlantProfile> = ({ changeCurrentTheme, currentTheme }) => {
  const { data } = trpc.getPlants.useQuery()
  const { plantId } = useParams()
  return (
    <div>
      <Header currentTheme={currentTheme} changeCurrentTheme={changeCurrentTheme}></Header>
      <Container maxWidth="sm" sx={{ bgcolor: 'background.default' }}>
        <h1>{data?.plants.find((obj) => obj.plantId === plantId)?.genus}</h1>
        <h2>{data?.plants.find((obj) => obj.plantId === plantId)?.species}</h2>
        <p>{data?.plants.find((obj) => obj.plantId === plantId)?.description}</p>
      </Container>
    </div>
  )
}
