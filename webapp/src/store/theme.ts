import { makeAutoObservable } from 'mobx'
import { TTheme } from '../types/types'

export class Theme {
  curentTheme: TTheme = 'light'
  constructor() {
    makeAutoObservable(this)
  }
  toggleTheme() {
    this.curentTheme = this.curentTheme === 'light' ? 'dark' : 'light'
  }
}

export const themeState = new Theme()
