import fs from 'fs/promises'
import { trpc } from '../../lib/trpc'
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
    // Удаляем префикс, если он есть
    const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, '')

    // Декодируем base64 в буфер
    const imageBuffer = Buffer.from(base64Data, 'base64')

    // Генерируем уникальное имя файла
    const imageUrl = `public/images/${Date.now()}.png`

    // Сохраняем файл
    await fs.writeFile(imageUrl, imageBuffer)

    // Сохраняем данные в базе
    await ctx.prisma.plant.create({
      data: { ...restInput, imageUrl },
    })
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Ошибка при сохранении изображения: ' + error.message)
    }
    throw new Error('Ошибка при сохранении изображения: Unknown error')
  }
})
