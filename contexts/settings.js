import React, {useState, useMemo} from 'react'

const SettingsContext = React.createContext()

export function SettingsContextProvider(props) {
  const [settingsDisplayed, setSettingsDisplayed] = useState('')

  const value = useMemo(() => ({
    settingsDisplayed,
    setSettingsDisplayed
  }), [settingsDisplayed])

  return (
    <SettingsContext.Provider value={value} {...props} />
  )
}

export const SettingsContextConsumer = SettingsContext.Consumer

export default SettingsContext
