import { Box } from '@mui/material'

import image404 from '../../assets/images/404-not-found 2.png'
export const NotFoundPage = () => {
  return (
    <Box
      component="img"
      src={image404}
      alt=""
      sx={{ maxWidth: '100%', height: 'auto' }}
    />
  )
}
