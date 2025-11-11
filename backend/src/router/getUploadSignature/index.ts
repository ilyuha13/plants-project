import { cloudinary } from '../../lib/cloudinary'
import { env } from '../../lib/env'
import { trpc } from '../../lib/trpc'

export const getUploadSignatureTrpcRoute = trpc.procedure.query(({ ctx }) => {
  if (!(ctx.me?.role === 'ADMIN')) {
    return 'нет доступа к получению подписи'
  }
  if (!(env.CLOUDINARY_API_SECRET && env.CLOUDINARY_API_KEY)) {
    return 'не установлены переменные окружения для работы с cloudinary'
  }
  const timestamp = Math.round(Date.now() / 1000)

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
