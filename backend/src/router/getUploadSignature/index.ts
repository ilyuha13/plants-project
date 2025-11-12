import { cloudinary } from '../../lib/cloudinary'
import { env } from '../../lib/env'
import { trpc } from '../../lib/trpc'

export const getUploadSignatureTrpcRoute = trpc.procedure.mutation(({ ctx }) => {
  if (!(ctx.me?.role === 'ADMIN')) {
    throw new Error('нет доступа к получению подписи')
  }
  if (!(env.CLOUDINARY_API_SECRET && env.CLOUDINARY_API_KEY)) {
    throw new Error('не установлены переменные окружения для работы с cloudinary')
  }
  const timestamp = Date.now()

  const uploadParams = {
    timestamp: timestamp,
    folder: 'plants',
  }

  const signature = cloudinary.utils.api_sign_request(uploadParams, env.CLOUDINARY_API_SECRET)

  return {
    signature,
    timestamp,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    folder: 'plants',
  }
})
