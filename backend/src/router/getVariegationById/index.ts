import { TRPCError } from '@trpc/server'

import { zGetVariegationByIdTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const getVariegationByIdTrpcRoute = trpc.procedure
  .input(zGetVariegationByIdTrpcInput)
  .query(async ({ ctx, input }) => {
    const variegation = await ctx.prisma.variegation.findUnique({
      where: { id: input.variegationId },
      include: {
        plants: {
          select: {
            plantId: true,
            name: true,
            imagesUrl: true,
            description: true,
            plantInstances: {
              select: {
                Id: true,
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
