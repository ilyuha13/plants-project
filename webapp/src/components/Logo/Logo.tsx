import { Typography } from '@mui/material'

export const Logo = ({ color }: { color: string }) => {
  return (
    <Typography
      variant="h4"
      sx={{
        color: { color },
        fontFamily: 'monospace',
        fontWeight: 800,
        letterSpacing: '.3rem',
      }}
    >
      GF
    </Typography>
  )
}
