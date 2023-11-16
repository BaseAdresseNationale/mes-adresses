import {OpenAPI, OpenAPIConfig} from '@/lib/openapi'
import React, {useCallback} from 'react'

const OpenAPIConfigContext = React.createContext<(config: Partial<OpenAPIConfig>) => void | null>(null)

interface OpenAPIConfigProviderProps {
  baseConfig?: Partial<OpenAPIConfig>;
  children: React.ReactNode;
}

export function OpenAPIConfigProvider({baseConfig, ...props}: OpenAPIConfigProviderProps) {
  if (baseConfig) {
    Object.assign(OpenAPI, baseConfig)
  }

  const setOpenAPIConfig = useCallback((config: Partial<OpenAPIConfig>) => {
    Object.assign(OpenAPI, config)
  }, [])

  return <OpenAPIConfigContext.Provider value={setOpenAPIConfig} {...props} />
}

export const OpenAPIConfigConsumer = OpenAPIConfigContext.Consumer

export default OpenAPIConfigContext
