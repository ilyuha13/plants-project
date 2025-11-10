import MuiAlert from '@mui/material/Alert'

export interface AlertProps { children: React.ReactNode; type: 'success' | 'info' | 'warning' | 'error' }

export const Alert = ({ children, type }: AlertProps) => {
  return (
    <MuiAlert variant="filled" severity={type}>
      {children}
    </MuiAlert>
  )
}
