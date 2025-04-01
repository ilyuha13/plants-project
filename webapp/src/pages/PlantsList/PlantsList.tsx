import { trpc } from '../../lib/trpc'

export const PlantsList = () => {
  const { data, error, isError, isFetching, isLoading } = trpc.getPlants.useQuery()

  if (isLoading || isFetching) {
    return <span>loading...</span>
  }

  if (isError) {
    return <span>error: {error.message}</span>
  }

  return (
    <div>
      <h1>plants</h1>

      {data?.plants.map((plant) => (
        <div key={plant.id}>
          <h1>{plant.genus}</h1>
          <p>{plant.species}</p>
        </div>
      ))}
    </div>
  )
}
