import { TRPCError } from '@trpc/server'

import { zAddPlantTrpcInput } from './input'
import { trpc } from '../../lib/trpc'

export const addPlantTrpcRoute = trpc.procedure.input(zAddPlantTrpcInput).mutation(async ({ ctx, input }) => {
  try {
    // TODO: Обновить форму на фронтенде для ввода genus отдельно
    // Временно извлекаем род из первого слова названия
    const genus = input.name.split(' ')[0]

    await ctx.prisma.plant.create({
      data: {
        ...input,
        genus, // Автоматически извлеченный род
      },
    })
    return true
  } catch (error: unknown) {
    console.error('Error: ', error)

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Не удалось добавить растение',
    })
  }
})
