import { trpc } from '../../lib/trpc'

export const PlantsList = () => {
  const { error, isError, isFetching, isLoading } = trpc.getPlants.useQuery()
  if (isLoading || isFetching) {
    return <span>loading...</span>
  }

  if (isError) {
    return <span>error: {error.message}</span>
  }

  return (
    <div>
      привет
      {/* <div>
        <h1>plants</h1>
      </div>
      <Grid
        sx={{
          paddingTop: 5,
          marginLeft: { sm: 3, lg: 25 },
          marginRight: { sm: 3, lg: 25 },
        }}
        justifyContent={'space-between'}
        container
        spacing={2}
      >
        {data?.plants.map((plant) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }} key={plant.plantInstanceId}>
            <PlantCard
              key={plant.plantInstanceId}
              species={plant.species}
              description={plant.description}
              plantInstanceId={plant.plantInstanceId}
              price={plant.price}
              createdAt={plant.createdAt}
              imagesUrl={plant.imagesUrl}
            />
          </Grid>
        ))}
      </Grid> */}
      {/* </div> */}
    </div>
  )
}
