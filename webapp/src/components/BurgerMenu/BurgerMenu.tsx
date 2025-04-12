import s from './burgerMenu.module.scss'

export const BurgerMenu = () => {
  return (
    <div className={s.burger}>
      <div className={s.line1}></div>
      <div className={s.line2}></div>
      <div className={s.line3}></div>
    </div>
  )
}
