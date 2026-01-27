import { TRPCError } from '@trpc/server'

import { zGetLifeFormByIdTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const getLifeFormByIdTrpcRoute = trpc.procedure
  .input(zGetLifeFormByIdTrpcInput)
  .query(async ({ ctx, input }) => {
    const lifeForm = await ctx.prisma.lifeForm.findUnique({
      where: { id: input.lifeFormId },
      include: {
        plants: {
          select: {
            id: true,
            name: true,
            imagesUrl: true,
            description: true,
            plantInstances: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })

    if (!lifeForm) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Жизненная форма не найдена',
      })
    }

    return { lifeForm }
  })
