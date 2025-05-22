import cn from 'classnames'
import s from './alert.module.scss'

export const Alert = ({ message, color }: { message: string; color: 'red' | 'green' }) => {
  return (
    <div className={cn({ [s.alert]: true, [s.red]: color === 'red', [s.green]: color === 'green' })}>{message}</div>
  )
}
