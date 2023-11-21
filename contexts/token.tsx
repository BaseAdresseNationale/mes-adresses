import React, {useState, useCallback, useEffect, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import LocalStorageContext from '@/contexts/local-storage'
import OpenAPIConfigContext from '@/contexts/open-api-config'
import {BasesLocalesService} from '@/lib/openapi'
import {ChildrenProps} from '@/types/context'

interface TokenContextType {
  token: string | null;
  emails: string[] | null;
  tokenIsChecking: boolean;
  reloadEmails: () => Promise<void>;
}

const TokenContext = React.createContext<TokenContextType | null>(null)

interface TokenContextProviderProps extends ChildrenProps {
  balId: string | null;
  _token: string | null;
}

export function TokenContextProvider({balId, _token, ...props}: TokenContextProviderProps) {
  const {getBalToken, addBalAccess} = useContext(LocalStorageContext)
  const setOpenAPIConfig = useContext(OpenAPIConfigContext)

  const [tokenIsChecking, setTokenIsChecking] = useState<boolean>(false)
  const [token, setToken] = useState<string>(null)
  const [emails, setEmails] = useState<string[]>(null)

  const verify = useCallback(async (token: string) => {
    setOpenAPIConfig({TOKEN: token})
    const baseLocale = await BasesLocalesService.findBaseLocale(balId)

    if (baseLocale.token) {
      setToken(baseLocale.token)
      setEmails(baseLocale.emails)
      setOpenAPIConfig({TOKEN: baseLocale.token})
    } else {
      setOpenAPIConfig({TOKEN: null})
      setToken(null)
    }

    setTokenIsChecking(false)
  }, [balId, setOpenAPIConfig])

  useEffect(() => {
    if (balId) {
      setTokenIsChecking(true)
      if (_token) {
        addBalAccess(balId, _token)
        void Router.push(`/bal/${balId}`)
      } else {
        const token: string = getBalToken(balId)
        void verify(token)
      }
    }
  }, [verify, balId, _token, addBalAccess, getBalToken])

  const reloadEmails = useCallback(async () => {
    const token: string = getBalToken(balId)
    await verify(token)
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
