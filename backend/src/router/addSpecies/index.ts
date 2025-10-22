import { trpc } from '../../lib/trpc'
import { saveImageBybase64ToFile } from '../../utils/saveImafeByBase64ToFile'
import { zAddSpeciesTrpcInput } from './input'

export const addSpeciesTrpcRoute = trpc.procedure.input(zAddSpeciesTrpcInput).mutation(async ({ ctx, input }) => {
  const { images, ...restInput } = input
  const imagesSrc = images.map((image) => image.src)
  try {
    const imagesUrl: string[] = []

    for (const imageSrc of imagesSrc) {
      imagesUrl.push(await saveImageBybase64ToFile(imageSrc))
    }

    await ctx.prisma.species.create({
      data: { ...restInput, imagesUrl },
    })
    return true
  } catch (error: unknown) {
    console.error('Error: ', error)
  }
})
