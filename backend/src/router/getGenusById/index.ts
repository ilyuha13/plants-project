import { TRPCError } from '@trpc/server'

import { zGetGenusByIdTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const getGenusByIdTrpcRoute = trpc.procedure.input(zGetGenusByIdTrpcInput).query(async ({ ctx, input }) => {
  const genus = await ctx.prisma.genus.findUnique({
    where: { id: input.genusId },
    include: {
      plants: {
        select: {
          plantId: true,
          name: true,
          imagesUrl: true,
          description: true,
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
