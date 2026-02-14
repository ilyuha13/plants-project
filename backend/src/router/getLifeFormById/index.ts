import { TRPCError } from '@trpc/server'

import { zGetLifeFormByIdTrpcInput } from './input'
import { publicProcedure } from '../../lib/trpc'

export const getLifeFormByIdTrpcRoute = publicProcedure
  .input(zGetLifeFormByIdTrpcInput)
  .query(async ({ ctx, input }) => {
    const lifeForm = await ctx.prisma.lifeForm.findUnique({
      where: { id: input.lifeFormId },
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

    if (!lifeForm) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Жизненная форма не найдена',
      })
    }

    return { lifeForm }
  })
