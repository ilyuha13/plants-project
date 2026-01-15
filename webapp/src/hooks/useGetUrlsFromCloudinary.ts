import { useEffect, useState } from 'react'

import { trpc } from '../lib/trpc'

export const useGetUrlsFromCloudinary = (fileArray: File[] | null) => {
  const signatureMutation = trpc.getUploadSignature.useMutation()
  const [urlArray, setUrlArray] = useState<string[] | null>(null)

  useEffect(() => {
    if (!fileArray) {
      return
    }
    const loadImages = async () => {
      try {
        const imageUrls = []
        for (const file of fileArray) {
          const signature = await signatureMutation.mutateAsync()

          const formData = new FormData()
          formData.append('file', file)
          formData.append('signature', signature.signature)
          formData.append('timestamp', signature.timestamp.toString())
          formData.append('api_key', signature.apiKey)
          formData.append('folder', signature.folder)

          const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
          })

          const result = (await response.json()) as { public_id: string }

          if (response.ok) {
            imageUrls.push(result.public_id)
          }
        }
        setUrlArray(imageUrls)
      } catch (error) {
        console.error('Failed to read files:', error)
      }
    }

    void loadImages()
  }, [fileArray])

  return urlArray
}
