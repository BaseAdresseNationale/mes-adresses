import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import {getBaseLocale} from '../lib/bal-api'
import {getBalToken, storeBalAccess} from '../lib/tokens'

const TokenContext = React.createContext()

export function TokenContextProvider({balId, token, ...props}) {
  const [state, setState] = useState({
    token: null
  })

  const verify = useCallback(async token => {
    const baseLocale = await getBaseLocale(balId, token)

    if (baseLocale.token) {
      setState({
        token: baseLocale.token,
        emails: baseLocale.emails
      })
    } else {
      setState({
        token: false
      })
    }
  }, [balId])

  useEffect(() => {
    if (balId) {
      if (token) {
        storeBalAccess(balId, token)

        Router.replace(
          `/bal?balId=${balId}`,
          `/bal/${balId}`
        )
      } else {
        verify(getBalToken(balId))
      }
    }
  }, [verify, balId, token])

  return (
    <TokenContext.Provider value={state} {...props} />
  )
}

TokenContextProvider.propTypes = {
  balId: PropTypes.string,
  token: PropTypes.string
}

TokenContextProvider.defaultProps = {
  balId: null,
  token: null
}

export const MarkerContextConsumer = TokenContext.Consumer

export default TokenContext
