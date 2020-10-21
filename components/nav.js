import React, {useContext, useCallback} from 'react'
import {Pane, Button, Link} from 'evergreen-ui'

import HelpContext from '../contexts/help'
import useHelp from '../hooks/help'

const Nav = () => {
  const {showHelp, setShowHelp, setSelectedIndex} = useContext(HelpContext)

  useHelp(0)

  const handleHelp = useCallback(() => {
    setSelectedIndex(0)
    setShowHelp(!showHelp)
  }, [setSelectedIndex, setShowHelp, showHelp])

  return (
    <Pane borderBottom padding={16} backgroundColor='white' display='flex' justifyContent='space-between' alignItems='center' flexShrink='0'>
      <img src='../static/images/mes-adresses.svg' />
      <Pane display='flex' justifyContent='space-around' alignItems='center'>
        <Button appearance='minimal' marginRight='12px' iconBefore='manual' minHeight='55px'>
          <Link href='https://adresse.data.gouv.fr/guides' textDecoration='none'>
            Guide de l’adressage
          </Link>
        </Button>
        <Button appearance='minimal' marginRight='12px' iconBefore='manual' minHeight='55px'>
          <Link textDecoration='none' onClick={handleHelp}>
            Guide interactif
          </Link>
        </Button>
      </Pane>
    </Pane>
  )
}

export default Nav
