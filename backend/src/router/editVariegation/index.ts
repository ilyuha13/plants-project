import { TRPCError } from '@trpc/server'

import { zEditVariegationTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const editVariegationTrpcRoute = adminProcedure
  .input(zEditVariegationTrpcInput)
  .mutation(async ({ input, ctx }) => {
    const { id, ...updateData } = input
    const varegation = await ctx.prisma.variegation.findUnique({
      where: {
        id,
      },
    })

    if (!varegation) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Вариегатность не найдена',
      })
    }
    const updatedVariegation = await ctx.prisma.variegation.update({
      where: {
        id,
      },
      data: updateData,
    })

    return updatedVariegation
  })
