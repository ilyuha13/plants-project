import MuiButton from '@mui/material/Button'

export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type: 'submit' | 'button' | 'reset'
}

export const Button = ({ children, loading, type, onClick }: ButtonProps) => {
  return (
    <MuiButton disabled={loading} onClick={onClick} type={type} variant="outlined" color="secondary">
      {loading ? 'подождем...' : children}
    </MuiButton>
  )
}
