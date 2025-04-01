import { initTRPC } from '@trpc/server'

const plants = [
    { genus: 'monstera', species: 'deliciosa', description: 'very big plant', id: 1 },
    { genus: 'monstera', species: 'obliqua', description: 'big plant', id: 2 },
    { genus: 'philodendron', species: 'florida', description: 'very big plant', id: 3 },
]

const trpc = initTRPC.create()


export const trpcRouter = trpc.router({
    getPlants: trpc.procedure
        .query(() => {
            return { plants }
        }),
})

export type TrpcRouter = typeof trpcRouter