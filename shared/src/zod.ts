import { z } from 'zod'

export const zNonemptyTrimmed = z.string().trim().min(1)
export const zStringOptional = z.string()
export const zNonemptyString = (message: string) => z.string().min(1, message)
export const zNonemtyImagesArray = z.string().min(1).array().min(1, 'должно быть загружено хотя бы одно фото')
export const zNonemptyTrimmedRequiredOnNotLocal = zNonemptyTrimmed
  .optional()
  .refine((val) => process.env.HOST_ENV === 'local' || !!val, 'Required on local host')
