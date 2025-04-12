import { observer, useLocalObservable } from 'mobx-react-lite'
import { createContext, ReactNode, useContext } from 'react'
import { Theme, themeState } from './theme'

const Context = createContext<Theme | null>(null)

export const AppStoreProvider = observer(({ children }: { children: ReactNode }) => {
  const store = useLocalObservable(() => themeState)
  return <Context.Provider value={store}>{children}</Context.Provider>
})

export const useAppStore = () => {
  const store = useContext(Context)
  if (!store) {
    throw new Error('Use App store within provider!')
  }
  return store
}
