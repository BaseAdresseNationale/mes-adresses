import React, {useState, useMemo} from 'react'

const HelpContext = React.createContext()

export function HelpContextProvider(props) {
  const [showHelp, setShowHelp] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const value = useMemo(() => ({
    showHelp,
    setShowHelp,
    selectedIndex,
    setSelectedIndex
  }), [showHelp, selectedIndex])

  return (
    <HelpContext.Provider value={value} {...props} />
  )
}

export const HelpContextConsumer = HelpContext.Consumer

export default HelpContext
