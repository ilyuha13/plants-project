import { initTRPC } from '@trpc/server'
import _, { toString } from 'lodash'
import { z } from 'zod'

const plants = _.times(100, (i) => ({
  genus: `plant ${i} genus`,
  species: `plant ${i} species`,
  description: `plant ${i} description`,
  plantId: toString(i),
}))

// const plants = [
//   { genus: 'monstera', species: 'deliciosa', description: 'very big plant', plantId: '1' },
//   { genus: 'monstera', species: 'obliqua', description: 'big plant', plantId: '2' },
//   { genus: 'philodendron', species: 'florida', description: 'very big plant', plantId: '3' },
// ]

const trpc = initTRPC.create()
export const trpcRouter = trpc.router({
  getPlants: trpc.procedure.query(() => {
    return { plants }
  }),
  getPlant: trpc.procedure.input(z.object({ plantId: z.string() })).query(({ input }) => {
    const plant = plants.find((plant) => plant.plantId === input.plantId)
    return { plant: plant || null }
  }),
})

export type TrpcRouter = typeof trpcRouter
