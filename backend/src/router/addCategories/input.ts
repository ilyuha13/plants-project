import { z } from 'zod'

export const zAddCategoriesTrpcInput = z.object({
  name: z.string().min(1, 'введите хотя-бы один символ'),
  description: z.string().min(1, 'введите хотя-бы один символ'),
})
