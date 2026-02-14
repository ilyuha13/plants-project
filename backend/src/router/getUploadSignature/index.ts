import { TRPCError } from '@trpc/server'

import { cloudinary } from '../../lib/cloudinary'
import { env } from '../../lib/env'
import { adminProcedure } from '../../lib/trpc'

export const getUploadSignatureTrpcRoute = adminProcedure.mutation(() => {
  if (!(env.CLOUDINARY_API_SECRET && env.CLOUDINARY_API_KEY)) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'не установлены переменные окружения для работы с cloudinary',
    })
  }
  const timestamp = Date.now()

  const uploadParams = {
    timestamp: timestamp,
    folder: 'plants',
  }

  const signature = cloudinary.utils.api_sign_request(
    uploadParams,
    env.CLOUDINARY_API_SECRET,
  )

  return {
    signature,
    timestamp,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    folder: 'plants',
  }
})
