import { Box, Button } from '@mui/material'
import { FC } from 'react'
import styles from './Header.module.scss'

type THeader = {
  changeCurrentTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>
  currentTheme: 'light' | 'dark'
}

export const Header: FC<THeader> = ({ changeCurrentTheme, currentTheme }) => {
  return (
    <Box className={styles.header} sx={{ bgcolor: 'background.default' }}>
      <Button variant="outlined">test</Button>
      <Button variant="contained" color="secondary">
        test 2
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          changeCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
        }}
      >
        theme
      </Button>
    </Box>
  )
}
