import fs from 'fs/promises'

import sharp from 'sharp'

export const saveImageBybase64ToFile = async (imageSrc: string) => {
  const base64Data = imageSrc.split(',')[1]

  const imageBuffer = Buffer.from(base64Data, 'base64')

  const imageUrl = `public/images/${Date.now()}.png`

  await fs.writeFile(imageUrl, sharp(imageBuffer).png())

  return imageUrl
}
