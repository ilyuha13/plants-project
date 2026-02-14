import { TRPCError } from '@trpc/server'

import { zSignInTrpcInput } from './input'
import { publicProcedure } from '../../lib/trpc'
import { verifyPassword } from '../../utils/getPasswordHash'
import { signJWT } from '../../utils/signJWT'

export const signInTrpcRoute = publicProcedure
  .input(zSignInTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        nick: input.nick,
      },
    })

    if (!user || !(await verifyPassword(input.password, user.password))) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Неверный ник или пароль' })
    }

    const token = signJWT(user.id)
    return { token }
  })
