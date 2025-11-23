import { TRPCError } from '@trpc/server'

import { zAddVariegationTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const addVariegationTrpcRoute = trpc.procedure
  .input(zAddVariegationTrpcInput)
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.variegation.create({
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
        message: 'не удалось добавить вариегатность',
      })
    }
  })
