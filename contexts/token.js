import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import getConfig from 'next/config'

import {getBaseLocale} from '../lib/bal-api'
import {getBalToken, getHasRecovered, setHasRecovered, storeBalAccess} from '../lib/tokens'

const {publicRuntimeConfig} = getConfig()
const EDITEUR_URL = publicRuntimeConfig.EDITEUR_URL || 'https://editeur.adresse.data.gouv.fr'

const TokenContext = React.createContext()

export function TokenContextProvider({balId, token, ...props}) {
  const [state, setState] = useState({
    token: null,
    hasRecovered: null
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

  useEffect(() => {
    if (state.hasRecovered === null) {
      const hasRecovered = getHasRecovered()
      if (hasRecovered) {
        setState({...state, hasRecovered: true})
      } else {
        setHasRecovered(true)
        Router.push(`${EDITEUR_URL}/recovery`)
      }
    }
  }, [state])

  const reloadEmails = useCallback(async () => {
    verify(getBalToken(balId))
  }, [verify, balId])

  return (
    <TokenContext.Provider value={{...state, reloadEmails}} {...props} />
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
