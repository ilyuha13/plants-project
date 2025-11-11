export const readFileArrayAsDataUrl = async (fileArray: File[]): Promise<string[]> => {
  const promises = fileArray.map((file) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string)
        } else {
          reject(new Error(`Failed to read file: ${file.name}`))
        }
      }
      reader.onerror = () => {
        reject(new Error(`Error reading file: ${file.name}`))
      }

      reader.readAsDataURL(file)
    })
  })

  return await Promise.all(promises)
}
