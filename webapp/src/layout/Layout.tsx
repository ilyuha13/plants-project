import { Box, Container } from '@mui/material'
import { ReactNode } from 'react'

type LayoutProps = {
  header?: ReactNode
  mainContent: ReactNode
  footer?: ReactNode
}

export const Layout = ({ header, mainContent, footer }: LayoutProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {header}

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {mainContent}
        </Container>
      </Box>

      {footer}
    </Box>
  )
}
