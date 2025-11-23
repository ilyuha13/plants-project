import { TRPCError } from '@trpc/server'

import { zAddPlantTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const addPlantTrpcRoute = trpc.procedure.input(zAddPlantTrpcInput).mutation(async ({ ctx, input }) => {
  try {
    await ctx.prisma.plant.create({
      data: input,
    })
    return true
  } catch (error: unknown) {
    console.error('Error: ', error)

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Не удалось добавить растение',
    })
  }
})
