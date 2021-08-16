import React, {useState, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import {getBaseLocale} from '../lib/bal-api'

import LocalStorageContext from './local-storage'

const TokenContext = React.createContext()

export function TokenContextProvider({balId, _token, ...props}) {
  const {getBalToken, addBalAccess} = useContext(LocalStorageContext)

  const [token, setToken] = useState(null)
  const [emails, setEmails] = useState(null)

  const verify = useCallback(async token => {
    const baseLocale = await getBaseLocale(balId, token)

    if (baseLocale.token) {
      setToken(baseLocale.token)
      setEmails(baseLocale.emails)
    } else {
      setToken(false)
    }
  }, [balId])

  useEffect(() => {
    if (balId) {
      if (_token) {
        addBalAccess(balId, _token)

        Router.replace(
          `/bal?balId=${balId}`,
          `/bal/${balId}`
        )
      } else {
        verify(getBalToken(balId))
      }
    }
  }, [verify, balId, _token, addBalAccess, getBalToken])

  const reloadEmails = useCallback(async () => {
    verify(getBalToken(balId))
  }, [verify, balId, getBalToken])

  return (
    <TokenContext.Provider value={{token, emails, reloadEmails}} {...props} />
  )
}

TokenContextProvider.propTypes = {
  balId: PropTypes.string,
  _token: PropTypes.string
}

TokenContextProvider.defaultProps = {
  balId: null,
  _token: null
}

export const MarkersContextConsumer = TokenContext.Consumer

export default TokenContext
