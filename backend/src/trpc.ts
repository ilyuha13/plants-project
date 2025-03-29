import { initTRPC } from '@trpc/server'

const plants = [
    { genus: 'monstera', species: 'deliciosa', description: 'very big plant' },
    { genus: 'monstera', species: 'obliqua', description: 'big plant' },
    { genus: 'philodendron', species: 'florida', description: 'very big plant' },
]

const trpc = initTRPC.create()

export const trpcRouter = trpc.router({
    getPlants: trpc.procedure.query(() => {
        return { plants }
    }),
})

export type TrpcRouter = typeof trpcRouter