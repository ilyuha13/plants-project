import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Button, Toolbar } from '@mui/material'

export const Navigation = () => {
  const isAdmin = true
  return (
    <Toolbar>
      {isAdmin && <Button sx={{ px: 5 }}> admin </Button>}
      <Button sx={{ px: 5 }} startIcon={<KeyboardArrowDownIcon fontSize="large" />}>
        каталог
      </Button>
    </Toolbar>
  )
}
