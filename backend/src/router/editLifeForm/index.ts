import { zEditLifeFormTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const editLifeFormTrpcRoute = trpc.procedure.input(zEditLifeFormTrpcInput).mutation(async ({ input, ctx }) => {
  const lifeForm = await ctx.prisma.lifeForm.findUnique({
    where: {
      id: input.id,
    },
  })

  if (!lifeForm) {
    throw new Error('LifeForm not found')
  }
  const updatedLifeForm = await ctx.prisma.lifeForm.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      description: input.description,
      imagesUrl: input.imagesUrl,
    },
  })

  return updatedLifeForm
})
