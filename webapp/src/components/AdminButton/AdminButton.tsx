import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined'
import { Badge, IconButton, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom'

import { getAdminPageRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const AdminButton = () => {
  const { data } = trpc.getPendingReservationRequests.useQuery(undefined, {
    refetchInterval: 60000,
  })
  const pendingCount = data?.count || 0

  return (
    <Tooltip title="Админка: запросы и брони, требующие внимания">
      <IconButton component={Link} to={getAdminPageRoute()} color="primary">
        <Badge badgeContent={pendingCount} color="error">
          <HandymanOutlinedIcon fontSize="large" />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}
