import { TRPCError } from '@trpc/server'

import { zDeleteGenusTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const deleteGenusTrpcRoute = trpc.procedure.input(zDeleteGenusTrpcInput).mutation(async ({ ctx, input }) => {
  const { genusId } = input

  if (!ctx.me) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Необходима авторизация для удаления рода',
    })
  }

  if (ctx.me.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Только администратор может удалять рода',
    })
  }

  try {
    await ctx.prisma.genus.delete({
      where: { id: genusId },
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error: ', error.message)
    } else {
      console.error('Error: ', String(error))
    }
  }

  return { success: true }
})
