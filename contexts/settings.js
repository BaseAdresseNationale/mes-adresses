import React, {useState, useMemo} from 'react'

const SettingsContext = React.createContext()

export function SettingsContextProvider(props) {
  const [isSettingsDisplayed, setIsSettingsDisplayed] = useState(false)

  const value = useMemo(() => ({
    isSettingsDisplayed,
    setIsSettingsDisplayed
  }), [isSettingsDisplayed])

  return (
    <SettingsContext.Provider value={value} {...props} />
  )
}

export const SettingsContextConsumer = SettingsContext.Consumer

export default SettingsContext
