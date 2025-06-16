import { env } from '../../lib/env'
import s from './logo.module.scss'

export const Logo = () => {
  return <img className={s.logo} src={`${env.VITE_BACKEND_URL}/images/logo.jpg`} alt="logo" />
}
