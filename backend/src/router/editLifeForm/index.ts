import { TRPCError } from '@trpc/server'

import { zEditLifeFormTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const editLifeFormTrpcRoute = adminProcedure
  .input(zEditLifeFormTrpcInput)
  .mutation(async ({ input, ctx }) => {
    const { id, ...updateData } = input
    const lifeForm = await ctx.prisma.lifeForm.findUnique({
      where: {
        id,
      },
    })

    if (!lifeForm) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Форма жизни не найдена',
      })
    }
    const updatedLifeForm = await ctx.prisma.lifeForm.update({
      where: {
        id,
      },
      data: updateData,
    })

    return updatedLifeForm
  })
