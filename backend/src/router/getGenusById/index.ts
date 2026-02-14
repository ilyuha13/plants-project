import { TRPCError } from '@trpc/server'

import { zGetGenusByIdTrpcInput } from './input'
import { publicProcedure } from '../../lib/trpc'

export const getGenusByIdTrpcRoute = publicProcedure
  .input(zGetGenusByIdTrpcInput)
  .query(async ({ ctx, input }) => {
    const genus = await ctx.prisma.genus.findUnique({
      where: { id: input.genusId },
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

    if (!genus) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Род не найден',
      })
    }

    return { genus }
  })
