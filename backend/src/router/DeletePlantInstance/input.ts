import { z } from 'zod'

export const zDeletePlantInstanceTrpcInput = z.object({
  Id: z.string().min(1),
})

export type DeletePlantInstanceTrpcInput = z.infer<typeof zDeletePlantInstanceTrpcInput>
