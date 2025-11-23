import { zNonemptyString, zNonemtyImagesArray, zStringOptional } from '@plants-project/shared'
import { z } from 'zod'

export const zAddLifeFormTrpcInput = z.object({
  name: zNonemptyString('не указано название'),
  description: zStringOptional,
  imagesUrl: zNonemtyImagesArray,
})
