import MuiButton from '@mui/material/Button'

export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type: 'submit' | 'button' | 'reset'
}

export const Button = ({ children, loading, type, onClick }: ButtonProps) => {
  return (
    <MuiButton sx={{ width: 100 }} disabled={loading} onClick={onClick} type={type} variant="outlined">
      {loading ? 'подождем...' : children}
    </MuiButton>
  )
}
