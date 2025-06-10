import MuiAlert from '@mui/material/Alert'

export type AlertProps = { children: React.ReactNode; hidden?: boolean; type: 'success' | 'info' | 'warning' | 'error' }

export const Alert = ({ hidden, children, type }: AlertProps) => {
  if (hidden) {
    return null
  }
  return (
    <MuiAlert variant="filled" severity={type}>
      {children}
    </MuiAlert>
  )
}
