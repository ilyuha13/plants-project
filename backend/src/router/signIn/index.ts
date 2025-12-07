import { zSignInTrpcInput } from './input'
import { trpc } from '../../lib/trpc'
import { verifyPassword } from '../../utils/getPasswordHash'
import { signJWT } from '../../utils/signJWT'

export const signInTrpcRoute = trpc.procedure.input(zSignInTrpcInput).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  })

  if (!user || !(await verifyPassword(input.password, user.password))) {
    throw new Error('Не верное имя или пароль')
  }

  const token = signJWT(user.id)
  return { token }
})
