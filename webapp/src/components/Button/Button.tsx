import MuiButton from '@mui/material/Button'

export interface ButtonProps {
  children: React.ReactNode
  loading?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'submit' | 'button' | 'reset'
  variant?: 'text' | 'outlined'
  sx?: object
}

export const Button = ({ sx, variant, children, loading, type, onClick }: ButtonProps) => {
  return (
    <MuiButton sx={sx} variant={variant} disabled={loading} onClick={onClick} type={type}>
      {loading ? 'подождем...' : children}
    </MuiButton>
  )
}
