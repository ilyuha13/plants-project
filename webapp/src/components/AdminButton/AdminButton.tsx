import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined'
import { IconButton, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom'

import { getAdminPageRoute } from '../../lib/routes'

export const AdminButton = () => {
  return (
    <Tooltip title="админка">
      <IconButton component={Link} to={getAdminPageRoute()} color="primary">
        <HandymanOutlinedIcon fontSize="large" />
      </IconButton>
    </Tooltip>
  )
}
