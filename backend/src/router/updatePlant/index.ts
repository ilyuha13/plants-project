import { trpc } from '../../lib/trpc'
import { saveImageBybase64ToFile } from '../../utils/saveImafeByBase64ToFile'
import { zUpdatePlantTrpcInput } from './input'

export const updatePlantTrpcRoute = trpc.procedure.input(zUpdatePlantTrpcInput).mutation(async ({ ctx, input }) => {
  const { plantId, images, ...plantInput } = input
  let imagesSrc: string[] = []
  if (images) {
    imagesSrc = images.map((image) => image.src)
    if (!ctx.me) {
      throw new Error('Unauthorized')
    }
  }

  const plant = await ctx.prisma.plant.findUnique({
    where: {
      plantId: plantId,
    },
  })

  if (!plant) {
    throw new Error('Plant not found')
  }

  try {
    const imagesUrl: string[] = []
    if (imagesSrc) {
      for (const imageSrc of imagesSrc) {
        imagesUrl.push(await saveImageBybase64ToFile(imageSrc))
      }
    }

    await ctx.prisma.plant.update({
      where: {
        plantId: plantId,
      },
      data: { ...plantInput, imagesUrl: imagesUrl },
    })
  } catch (error: unknown) {
    console.error('Error: ', error)
  }

  return true
})
