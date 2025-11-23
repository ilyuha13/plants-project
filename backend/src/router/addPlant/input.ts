import { zNonemptyString, zNonemtyImagesArray } from '@plants-project/shared'
import { z } from 'zod'

export const zAddPlantTrpcInput = z.object({
  genusId: zNonemptyString('не указан род'),
  variegationId: zNonemptyString('не указан тип вариегатности'),
  lifeFormId: zNonemptyString('не указана жизненная форма'),
  name: z.string().min(1, 'название обязательно для заполнения'),
  description: z.string(),
  imagesUrl: zNonemtyImagesArray,
})
