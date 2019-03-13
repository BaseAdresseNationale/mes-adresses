import {useState, useEffect} from 'react'

import {getBalToken} from '../lib/tokens'

function useToken(balId) {
  const [token, setToken] = useState()

  useEffect(() => {
    setToken(getBalToken(balId))
  }, [balId])

  return token
}

export default useToken
