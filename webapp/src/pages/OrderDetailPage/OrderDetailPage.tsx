import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'

import { CardsCollection } from '../../components/CardsCollection/CardsCollection'
import { OrderDetailRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const OrderDetailPage = () => {
  const { orderId } = useParams() as OrderDetailRouteParams

  const { data, isError, isLoading, error } = trpc.getOrder.useQuery(
    { orderId: orderId },
    { enabled: !!orderId },
  )

  if (isError) {
    console.error(error)
    return <Box>error</Box>
  }
  if (isLoading) {
    return <Box>...Loading</Box>
  }

  if (!data?.order) {
    return
  }

  const instances = data.order.items.map((item) => ({
    createdAt: item.plantInstance.createdAt,
    description: item.plantInstance.description,
    imagesUrl: item.plantInstance.imagesUrl,
    status: item.plantInstance.status,
    inventoryNumber: item.plantInstance.inventoryNumber,
    price: String(item.plantInstance.price),
    id: item.plantInstance.id,
    name: item.plantInstance.plant.name,
  }))

  return (
    <CardsCollection
      data={instances}
      title="order"
      type="instance"
      onCardClick={() => null}
      onCardDelete={() => null}
    />
  )
}
