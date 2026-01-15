import { zNonemptyString, zNonemtyImagesArray } from '@plants-project/shared'
import { z } from 'zod'

export const zEditPlantTrpcInput = z.object({
  id: zNonemptyString,
  genusId: zNonemptyString,
  variegationId: zNonemptyString,
  lifeFormId: zNonemptyString,
  name: z.string().min(1, 'название обязательно для заполнения'),
  description: z.string(),
  imagesUrl: zNonemtyImagesArray,
})
