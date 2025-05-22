import { z } from 'zod'
const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const zAddPlantTrpcInput = z.object({
  genus: z.string().min(1, 'введите хотя-бы один символ'),
  species: z.string().min(1, 'введите хотя-бы один символ'),
  description: z.string().min(1, 'введите хотя-бы один символ'),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.',
    ),
})
