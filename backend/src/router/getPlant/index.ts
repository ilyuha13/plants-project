import { TRPCError } from '@trpc/server'

import { zGetPlantTrpcInput } from './input'
import { publicProcedure } from '../../lib/trpc'

export const getPlantTrpcRoute = publicProcedure
  .input(zGetPlantTrpcInput)
  .query(async ({ ctx, input }) => {
    const isAdmin = ctx.me?.role === 'ADMIN'
    const plant = await ctx.prisma.plant.findUnique({
      where: {
        id: input.id,
      },
      include: {
        plantInstances: {
          where: isAdmin ? {} : { status: 'AVAILABLE' },
        },
      },
    })

    if (!plant) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Растение не найдено',
      })
    }

    return { plant }
  })
