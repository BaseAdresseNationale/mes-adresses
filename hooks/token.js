import {useState, useLayoutEffect} from 'react'

import {getBalToken} from '../lib/tokens'

function useToken(balId) {
  const [token, setToken] = useState()

  useLayoutEffect(() => {
    setToken(getBalToken(balId))
  }, [balId])

  return token
}

export default useToken
