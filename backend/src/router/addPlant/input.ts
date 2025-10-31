import { z } from 'zod'

export const zAddPlantTrpcInput = z.object({
  name: z.string().min(1, 'название обязательно для заполнения'),
  description: z.string(),
  images: z.string().min(1).array().min(1, 'должно быть загружено хотя бы одно фото'),
})
