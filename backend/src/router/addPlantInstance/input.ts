import { z } from 'zod'

export const zAddPlantInstanceTrpcInput = z.object({
  inventoryNumber: z
    .string()
    .min(1, 'инвентарный номер обязателен к заполнению')
    .regex(/^\d+$/, 'инвентарный номер должен содержать только цифры'),
  plantId: z.string().min(1, 'не выбран вид растения'),
  price: z.string().min(1, 'цена обязательна').regex(/^\d+$/, 'цена должна содержать только цифры'),
  description: z.string(),
  imagesUrl: z.string().min(1).array().min(1, 'должно быть загружено хотя бы одно фото'),
})
