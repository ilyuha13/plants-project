import { TRPCError } from '@trpc/server'

import { zGetVariegationByIdTrpcInput } from './input'
import { publicProcedure } from '../../lib/trpc'

export const getVariegationByIdTrpcRoute = publicProcedure
  .input(zGetVariegationByIdTrpcInput)
  .query(async ({ ctx, input }) => {
    const variegation = await ctx.prisma.variegation.findUnique({
      where: { id: input.variegationId },
      include: {
        plants: {
          include: {
            plantInstances: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })

    if (!variegation) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Вариегатность не найдена',
      })
    }

    return { variegation }
  })
