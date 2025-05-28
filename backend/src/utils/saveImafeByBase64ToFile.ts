import fs from 'fs/promises'

export const saveImageBybase64ToFile = async (imageSrc: string | undefined) => {
  if (!imageSrc) {
    return undefined
  }
  const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, '')

  const imageBuffer = Buffer.from(base64Data, 'base64')

  const imageUrl = `public/images/${Date.now()}.png`

  await fs.writeFile(imageUrl, imageBuffer)

  return imageUrl
}
