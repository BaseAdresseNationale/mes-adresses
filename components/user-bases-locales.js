import React, {useState, useEffect} from 'react'
import {Pane, Heading} from 'evergreen-ui'
import {map} from 'lodash-es'

import {getBalAccess} from '../lib/tokens'
import {getBaseLocale} from '../lib/bal-api'

import BasesLocalesList from './bases-locales-list'

function UserBasesLocales() {
  const [bals, setbals] = useState([])

  useEffect(() => {
    const balAccess = getBalAccess()
    const getUserBals = async () => {
      const bals = await Promise.all(
        map(balAccess, async (token, id) => {
          try {
            return await getBaseLocale(id, token)
          } catch (error) {
            console.log(`Impossible de récupérer la bal ${id}`)
          }
        }))

      setbals(bals.filter(bal => Boolean(bal)))
    }

    if (balAccess) {
      getUserBals()
    }
  }, [])

  if (bals.length === 0) {
    return null
  }

  return (
    <Pane flex={2}>
      <Heading padding={16} size={400}>Mes Bases Adresse Locales</Heading>
      <BasesLocalesList basesLocales={bals} />
    </Pane>
  )
}

export default UserBasesLocales
