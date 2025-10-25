import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
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

    // Проверка на ошибку уникальности Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Растение с таким инвентарным номером уже существует',
        })
      }
    }

    // Выбрасываем все остальные ошибки
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Не удалось добавить растение',
    })
  }
})
