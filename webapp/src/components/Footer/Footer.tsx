import { Box } from '@mui/material'

import { Logo } from '../Logo/Logo'

export const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main' }}>
      <Logo color="secondary" />
    </Box>
  )
}
