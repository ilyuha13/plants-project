import { TRPCError } from '@trpc/server'

import { zAddLifeFormTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const addLifeFormTrpcRoute = trpc.procedure.input(zAddLifeFormTrpcInput).mutation(async ({ ctx, input }) => {
  try {
    await ctx.prisma.lifeForm.create({
      data: input,
    })
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error: ', error.message)
    } else {
      console.error('Error: ', String(error))
    }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Не удалось добавить растение',
    })
  }
})
