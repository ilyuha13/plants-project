import { env } from './env'

export const getCloudinaryUrl = (imageId: string) => {
  const thumbnailUrl = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_300,h_300,c_fit,q_auto:low,f_auto/${imageId}`
  const mediumUrl = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_800,h_800,c_fit,q_auto:good,f_auto/${imageId}`
  const smallUrl = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_100,h_100,c_fit,q_auto:low,f_auto/${imageId}`
  const fullUrl = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_1200,h_1200,c_fit,q_auto:best,f_auto/${imageId}`

  return { thumbnailUrl, mediumUrl, smallUrl, fullUrl }
}
