import React, {useState} from 'react'

const HelpContext = React.createContext()

export function HelpContextProvider(props) {
  const [showHelp, setShowHelp] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <HelpContext.Provider
      value={{
        showHelp,
        setShowHelp,
        selectedIndex,
        setSelectedIndex,
      }}
      {...props}
    />
  )
}

export const HelpContextConsumer = HelpContext.Consumer

export default HelpContext
