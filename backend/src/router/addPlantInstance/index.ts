import { TRPCError } from '@trpc/server'

import { zAddPlantInstanceTrpcInput } from './input'
import { trpc } from '../../lib/trpc'
import { saveImageBybase64ToFile } from '../../utils/saveImafeByBase64ToFile'

export const addPlantInstanceTrpcRoute = trpc.procedure
  .input(zAddPlantInstanceTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { images, ...restInput } = input

    try {
      const imagesUrl: string[] = []

      for (const imageSrc of images) {
        imagesUrl.push(await saveImageBybase64ToFile(imageSrc))
      }

      await ctx.prisma.plantInstance.create({
        data: { ...restInput, imagesUrl },
      })
      return true
    } catch (error: unknown) {
      console.error('Error: ', error)

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Не удалось добавить экземпляр растения',
      })
    }
  })
