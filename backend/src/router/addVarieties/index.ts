import { trpc } from '../../lib/trpc'
import { saveImageBybase64ToFile } from '../../utils/saveImafeByBase64ToFile'
import { zAddVarietiesTrpcInput } from './input'

export const addVarietiesTrpcRoute = trpc.procedure.input(zAddVarietiesTrpcInput).mutation(async ({ ctx, input }) => {
  const { images, ...restInput } = input
  const imagesSrc = images.map((image) => image.src)
  try {
    const imagesUrl: string[] = []

    for (const imageSrc of imagesSrc) {
      imagesUrl.push(await saveImageBybase64ToFile(imageSrc))
    }

    await ctx.prisma.variety.create({
      data: { ...restInput, imagesUrl },
    })
    return true
  } catch (error: unknown) {
    console.error('Error: ', error)
  }
})
