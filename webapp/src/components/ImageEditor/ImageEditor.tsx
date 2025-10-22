import React, { useEffect, useRef, useState } from 'react'
import ReactCrop, { makeAspectCrop, PercentCrop, PixelCrop, type Crop } from 'react-image-crop'
export const ImageEditor = ({
  image,
  onCroped,
  setImage,
  onSaved,
}: {
  image: { src: string; name: string }
  onCroped: boolean
  onSaved: boolean
  setImage: React.Dispatch<
    React.SetStateAction<{
      src: string
      name: string
    } | null>
  >
  //onSaved: boolean
}) => {
  const MIN_DEMENTION = 20
  const ASPECT_RATIO = 3 / 4
  const [crop, setCrop] = useState<Crop>()
  const canvasRef = useRef(null as HTMLCanvasElement | null)
  const [curentImage, setCurentImage] = useState<{ src: string; name: string } | null>(null)

  interface ImageLoadEvent extends React.SyntheticEvent<HTMLImageElement, Event> {
    currentTarget: EventTarget & HTMLImageElement
  }

  const onImageLoad = (e: ImageLoadEvent): void => {
    const { naturalWidth, naturalHeight } = e.currentTarget
    const crop = makeAspectCrop(
      {
        unit: '%',
        width: MIN_DEMENTION,
      },
      ASPECT_RATIO,
      naturalWidth,
      naturalHeight,
    )
    setCrop(crop)
  }

  useEffect(() => {
    if (!onCroped) {
      // console.log(image, savedImage)

      // setImage(savedImage)
      return
    }
    if (!canvasRef.current || !crop) {
      return
    }
    //setOnCroped(true)
    const canvas = canvasRef.current
    const cropedImage = new Image()
    cropedImage.src = image.src
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientWidth / ASPECT_RATIO

    ctx.drawImage(
      cropedImage,
      (crop.x * cropedImage.width) / 100,
      (crop.y * cropedImage.height) / 100,
      (crop.width * cropedImage.width) / 100,
      (crop.height * cropedImage.height) / 100,
      0,
      0,
      canvas.width,
      canvas.height,
    )
    const newImageUrl = canvas.toDataURL('image/jpeg')
    setCurentImage({ src: newImageUrl, name: image.name })
  }, [onCroped])

  useEffect(() => {
    if (!onSaved) {
      return
    }
    setImage(curentImage)
  }, [onSaved])

  return (
    <React.Fragment>
      {!onCroped ? (
        <ReactCrop
          crop={crop}
          keepSelection
          aspect={ASPECT_RATIO}
          minWidth={MIN_DEMENTION}
          onChange={(_crop: PixelCrop, percentCrop: PercentCrop) => {
            setCrop(percentCrop)
          }}
        >
          <img src={image.src} alt={image.name} onLoad={onImageLoad} />
        </ReactCrop>
      ) : (
        <canvas ref={canvasRef} style={{ width: '100%' }} />
      )}
    </React.Fragment>
  )
}
