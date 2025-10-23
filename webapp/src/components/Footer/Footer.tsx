import { Box } from '@mui/material'
import { Logo } from '../Logo/Logo'

export const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main' }}>
      <Logo color="secondary" />
    </Box>
  )
}
