import { useEffect, useRef } from 'react'

export const ImageInput = ({
  setImage,
  call,
}: {
  setImage: React.Dispatch<
    React.SetStateAction<{
      src: string
      name: string
    } | null>
  >
  call: boolean
}) => {
  const reader = new FileReader()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!call) {
      return
    }
    inputRef.current?.click()
  }, [call])
  return (
    <input
      ref={inputRef}
      onChange={(e) => {
        if (e.target.files) {
          const imgFile = e.target.files[0]

          reader.readAsDataURL(imgFile)
          reader.onload = () => {
            const readerResult = reader.result

            setImage({ src: readerResult as string, name: imgFile.name })
          }
        }
      }}
      type="file"
    />
  )
}
