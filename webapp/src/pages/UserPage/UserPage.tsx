import { Box, Paper, Stack } from '@mui/material'

import { useMe } from '../../lib/ctx'

export const UserPage = () => {
  const me = useMe()

  return (
    <Box>
      <Paper
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          minHeight: '70vh',
        }}
      >
        <Stack>
          {me?.nick}
          {me?.role}
          {me?.isGuest}
        </Stack>
      </Paper>
    </Box>
  )
}
