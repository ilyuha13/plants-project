import { Box, Container } from '@mui/material'
import { ReactNode } from 'react'

interface LayoutProps {
  header?: ReactNode
  mainContent: ReactNode
  footer?: ReactNode
  cart?: ReactNode
}

export const Layout = ({ header, mainContent, footer, cart }: LayoutProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {header}
      {cart}

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {mainContent}
        </Container>
      </Box>

      {footer}
    </Box>
  )
}
