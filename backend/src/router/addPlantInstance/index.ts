import { TRPCError } from '@trpc/server'

import { zAddPlantInstanceTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const addPlantInstanceTrpcRoute = trpc.procedure
  .input(zAddPlantInstanceTrpcInput)
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.plantInstance.create({
        data: input,
      })
      return true
    } catch (error: unknown) {
      console.error('Error: ', error)

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Не удалось добавить экземпляр растения',
      })
    }
  })
