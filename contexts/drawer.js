import React, {useState, useMemo} from 'react'

const DrawerContext = React.createContext()

export function DrawerContextProvider(props) {
  const [drawerDisplayed, setDrawerDisplayed] = useState('')

  const value = useMemo(() => ({
    drawerDisplayed,
    setDrawerDisplayed
  }), [drawerDisplayed])

  return (
    <DrawerContext.Provider value={value} {...props} />
  )
}

export const DrawerContextConsumer = DrawerContext.Consumer

export default DrawerContext
