import { z } from 'zod'

export const zDeletePlantTrpcInput = z.object({
  plantId: z.string().min(1),
})

export type DeletePlantTrpcInput = z.infer<typeof zDeletePlantTrpcInput>
