import MuiButton from '@mui/material/Button'

export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'submit' | 'button' | 'reset'
  variant?: 'text' | 'outlined'
}

export const Button = ({ variant, children, loading, type, onClick }: ButtonProps) => {
  return (
    <MuiButton variant={variant} disabled={loading} onClick={onClick} type={type}>
      {loading ? 'подождем...' : children}
    </MuiButton>
  )
}
