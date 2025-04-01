import { useState } from 'react'

export const useTheme = () => {
  const [currentTheme, changeCurrentTheme] = useState<'light' | 'dark'>('light')
  return [currentTheme, changeCurrentTheme]
}
