import { Box, Container } from '@mui/material'
import { ReactNode } from 'react'

interface LayoutProps {
  header?: ReactNode
  mainContent: ReactNode
  footer?: ReactNode
  cart?: ReactNode
  menu?: ReactNode
}

export const Layout = ({ header, mainContent, footer, cart, menu }: LayoutProps) => {
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
      {menu}

      <Box right="0px" component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {mainContent}
        </Container>
      </Box>

      {footer}
    </Box>
  )
}
