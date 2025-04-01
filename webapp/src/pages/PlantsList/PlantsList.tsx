import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { getPlantProfileRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

type TPlantsList = {
  changeCurrentTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>
  currentTheme: 'light' | 'dark'
}

export const PlantsList: FC<TPlantsList> = ({ changeCurrentTheme, currentTheme }) => {
  const { data, error, isError, isFetching, isLoading } = trpc.getPlants.useQuery()

  if (isLoading || isFetching) {
    return <span>loading...</span>
  }

  if (isError) {
    return <span>error: {error.message}</span>
  }

  return (
    <div>
      <Header currentTheme={currentTheme} changeCurrentTheme={changeCurrentTheme} />
      <h1>plants</h1>

      {data?.plants.map((plant) => (
        <div key={plant.plantId}>
          <h1>
            <Link to={getPlantProfileRoute({ plantId: plant.plantId })}>{plant.genus}</Link>
          </h1>
          <p>{plant.species}</p>
        </div>
      ))}
    </div>
  )
}
