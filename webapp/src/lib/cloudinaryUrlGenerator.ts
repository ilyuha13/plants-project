import { env } from './env'

export const getCloudinaryUrl = (imageId: string, type: 'thumbnail' | 'medium' | 'small' | 'full') => {
  let imageUrl = ''
  switch (type) {
    case 'full':
      imageUrl = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_1200,h_1200,c_fit,q_auto:best,f_auto/${imageId}`
      break
    case 'medium':
      imageUrl = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_800,h_800,c_fit,q_auto:good,f_auto/${imageId}`
      break
    case 'small':
      imageUrl = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_100,h_100,c_fit,q_auto:low,f_auto/${imageId}`
      break
    case 'thumbnail':
      imageUrl = `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_300,h_300,c_fit,q_auto:low,f_auto/${imageId}`
      break
  }

  return imageUrl
}
