import {useContext, useState, useEffect} from 'react'
import {Alert, Button, Text} from 'evergreen-ui'

import LocalStorageContext from '../contexts/local-storage'

function HiddenBal() {
  const {setHiddenBal, hiddenBal} = useContext(LocalStorageContext)
  const [hiddenBalList, setHiddenBalList] = useState([])

  useEffect(() => {
    if (hiddenBal) {
      setHiddenBalList(Object.keys(hiddenBal))
    } else {
      setHiddenBalList([])
    }
  }, [hiddenBal])

  const showAllBal = () => {
    setHiddenBal(null)
    setHiddenBalList([])
  }

  return (
    <div>
      {hiddenBalList.length > 0 && (
        <Alert intent='warning'>
          <Text>
            Il y a {hiddenBalList.length} base{hiddenBalList.length > 1 ? 's' : ''} adresse{hiddenBalList.length > 1 ? 's' : ''} locale{hiddenBalList.length > 1 ? 's' : ''} non listée{hiddenBalList.length > 1 ? 's' : ''}.
            Pour l{hiddenBalList.length > 1 ? 'es ' : '’'}afficher
          </Text>
          <Button appearance='primary' marginLeft='1em' onClick={() => showAllBal()}>Cliquez ici</Button>
        </Alert>
      )}
    </div>
  )
}

export default HiddenBal
