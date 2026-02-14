import { zSignUpTrpcInput } from './input'
import { publicProcedure } from '../../lib/trpc'
import { getPasswordHash } from '../../utils/getPasswordHash'
import { signJWT } from '../../utils/signJWT'

export const signUpTrpcRoute = publicProcedure
  .input(zSignUpTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const exUser = await ctx.prisma.user.findUnique({
      where: {
        nick: input.nick,
      },
    })
    if (exUser) {
      throw new Error('Это имя не уникально')
    }
    const user = await ctx.prisma.user.create({
      data: {
        nick: input.nick,
        password: await getPasswordHash(input.password),
      },
    })
    const token = signJWT(user.id)
    return { token }
  })
