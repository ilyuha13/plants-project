import { TRPCError } from '@trpc/server'

import { zEditGenusTrpcInput } from './input'
import { adminProcedure } from '../../lib/trpc'

export const editGenusTrpcRoute = adminProcedure
  .input(zEditGenusTrpcInput)
  .mutation(async ({ input, ctx }) => {
    const { id, ...updateData } = input
    const genus = await ctx.prisma.genus.findUnique({
      where: {
        id,
      },
    })

    if (!genus) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Род не найден',
      })
    }
    const updatedGenus = await ctx.prisma.genus.update({
      where: {
        id,
      },
      data: updateData,
    })

    return updatedGenus
  })
