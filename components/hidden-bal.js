import {useContext} from 'react'
import {Alert, Button, Text} from 'evergreen-ui'

import LocalStorageContext from '../contexts/local-storage'

function HiddenBal() {
  const {setHiddenBal, hiddenBal} = useContext(LocalStorageContext)
  const isPlural = hiddenBal ? Object.keys(hiddenBal).length > 1 : false

  return (
    <div>
      {hiddenBal && Object.keys(hiddenBal).length > 0 && (
        <Alert intent='warning'>
          <Text>
            Il y a {Object.keys(hiddenBal).length} base{isPlural ? 's' : ''} adresse{isPlural ? 's' : ''} locale{isPlural ? 's' : ''} non listée{isPlural ? 's' : ''}.
            Pour l{isPlural ? 'es ' : '’'}afficher
          </Text>
          <Button appearance='primary' marginLeft='1em' onClick={() => setHiddenBal(null)}>Cliquez ici</Button>
        </Alert>
      )}
    </div>
  )
}

export default HiddenBal
