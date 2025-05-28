import { z } from 'zod'

export const zAddPlantTrpcInput = z.object({
  genus: z.string().min(1, 'введите хотя-бы один символ'),
  species: z.string().min(1, 'введите хотя-бы один символ'),
  description: z.string().min(1, 'введите хотя-бы один символ'),
  categoryId: z.string().min(1, 'введите хотя-бы один символ'),
  imageSrc: z.string(),
})
