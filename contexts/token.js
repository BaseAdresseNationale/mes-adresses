import React, {useState, useCallback, useEffect, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import {getBaseLocale} from '@/lib/bal-api'
import {OpenAPI} from '@/lib/openapi'

import LocalStorageContext from '@/contexts/local-storage'

OpenAPI.BASE = process.env.NEXT_PUBLIC_MES_ADRESSES_API_URL

const TokenContext = React.createContext()

export function TokenContextProvider({balId, _token, ...props}) {
  const {getBalToken, addBalAccess} = useContext(LocalStorageContext)

  const [tokenIsChecking, setTokenIsChecking] = useState(false)
  const [token, setToken] = useState(null)
  const [emails, setEmails] = useState(null)

  const verify = useCallback(async token => {
    const baseLocale = await getBaseLocale(balId, token)

    if (baseLocale.token) {
      setToken(baseLocale.token)
      setEmails(baseLocale.emails)
    } else {
      setToken(null)
    }

    setTokenIsChecking(false)
  }, [balId])

  useEffect(() => {
    if (balId) {
      setTokenIsChecking(true)
      if (_token) {
        addBalAccess(balId, _token)
        Router.push(`/bal/${balId}`)
      } else {
        verify(getBalToken(balId))
      }
    }
  }, [verify, balId, _token, addBalAccess, getBalToken])

  const reloadEmails = useCallback(async () => {
    verify(getBalToken(balId))
  }, [verify, balId, getBalToken])

  const value = useMemo(() => ({
    token, emails, reloadEmails, tokenIsChecking
  }), [token, emails, reloadEmails, tokenIsChecking])

  return (
    <TokenContext.Provider value={value} {...props} />
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
