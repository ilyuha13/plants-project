import { zNonemptyString, zNonemtyImagesArray } from '@plants-project/shared'
import { z } from 'zod'

export const zAddPlantTrpcInput = z.object({
  genusId: zNonemptyString,
  variegationId: zNonemptyString,
  lifeFormId: zNonemptyString,
  name: z.string().min(1, 'название обязательно для заполнения'),
  description: z.string(),
  imagesUrl: zNonemtyImagesArray,
})
