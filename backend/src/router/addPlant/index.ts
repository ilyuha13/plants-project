import { trpc } from '../../lib/trpc'
import { saveImageBybase64ToFile } from '../../utils/saveImafeByBase64ToFile'
import { zAddPlantTrpcInput } from './input'

export const addPlantTrpcRoute = trpc.procedure.input(zAddPlantTrpcInput).mutation(async ({ ctx, input }) => {
  const exPlant = await ctx.prisma.plant.findMany({
    where: {
      genus: input.genus,
      species: input.species,
    },
  })
  if (exPlant.length > 0) {
    throw Error('такое уже есть')
  }
  const { imageSrc, ...restInput } = input

  try {
    const imageUrl = await saveImageBybase64ToFile(imageSrc)
    if (!imageUrl) {
      throw new Error('Не удалось сохранить изображение')
    }
    await ctx.prisma.plant.create({
      data: { ...restInput, imageUrl },
    })
    return true
  } catch (error: unknown) {
    console.error('Error: ', error)
  }
})
