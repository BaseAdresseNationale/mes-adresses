import React, {useState} from 'react'

const SettingsContext = React.createContext()

export function SettingsContextProvider(props) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <SettingsContext.Provider
      value={{
        showSettings,
        setShowSettings,
      }}
      {...props}
    />
  )
}

export const SettingsContextConsumer = SettingsContext.Consumer

export default SettingsContext
