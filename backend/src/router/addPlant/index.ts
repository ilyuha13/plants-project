import { trpc } from '../../lib/trpc'
import { saveImageBybase64ToFile } from '../../utils/saveImafeByBase64ToFile'
import { zAddPlantTrpcInput } from './input'

export const addPlantTrpcRoute = trpc.procedure.input(zAddPlantTrpcInput).mutation(async ({ ctx, input }) => {
  const { images, ...restInput } = input

  try {
    const imagesUrl: string[] = []

    for (const imageSrc of images) {
      imagesUrl.push(await saveImageBybase64ToFile(imageSrc))
    }

    await ctx.prisma.plant.create({
      data: { ...restInput, imagesUrl },
    })
    return true
  } catch (error: unknown) {
    console.error('Error: ', error)
  }
})
