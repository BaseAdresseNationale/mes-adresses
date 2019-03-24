import {useState, useEffect} from 'react'

import {getBaseLocale} from '../lib/bal-api'
import {getBalToken} from '../lib/tokens'

function useToken(balId) {
  const [token, setToken] = useState()

  useEffect(() => {
    async function verify(token) {
      const baseLocale = await getBaseLocale(balId, token)

      if (baseLocale.token) {
        setToken(getBalToken(balId))
      }
    }

    verify(getBalToken(balId))
  }, [balId])

  return token
}

export default useToken
