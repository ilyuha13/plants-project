import { trpc } from '../../lib/trpc'

export const PlantsList = () => {
  const result = trpc.getPlants.useQuery()
  console.log(result)
  const plants = result.data?.plants

  return (
    <div>
      <h1>plants</h1>
      {result.isLoading && 'Loading...'}
      {plants?.map((plant) => (
        <div key={plant.id}>
          <h1>{plant.genus}</h1>
          <p>{plant.species}</p>
        </div>
      ))}
    </div>
  )
}
