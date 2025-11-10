import { z } from 'zod'
export const zNonemptyTrimmed = z.string().trim().min(1)
export const zNonemptyTrimmedRequiredOnNotLocal = zNonemptyTrimmed
  .optional()
  .refine((val) => process.env.HOST_ENV === 'local' || !!val, 'Required on local host')
//# sourceMappingURL=zod.js.map
