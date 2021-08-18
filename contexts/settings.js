import React, {useMemo, useState} from 'react'

const SettingsContext = React.createContext()

export function SettingsContextProvider(props) {
  const [showSettings, setShowSettings] = useState(false)
  const value = useMemo(() => ({
    showSettings,
    setShowSettings,
  }), [showSettings])

  return (
    <SettingsContext.Provider value={value} {...props} />
  )
}

export const SettingsContextConsumer = SettingsContext.Consumer

export default SettingsContext
