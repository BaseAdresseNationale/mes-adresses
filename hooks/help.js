import {useEffect, useContext} from 'react'

import HelpContext from '@/contexts/help'

function useHelp(index) {
  const {showHelp, selectedIndex, setSelectedIndex} = useContext(HelpContext)

  useEffect(() => {
    if (!showHelp && selectedIndex !== index) {
      setSelectedIndex(index)
    }
  }, [index, selectedIndex, setSelectedIndex, showHelp])
}

export default useHelp
