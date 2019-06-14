import React, {useState, useEffect} from 'react'
import {Pane, Heading} from 'evergreen-ui'
import {map} from 'lodash-es'

import {expandWithPublished} from '../helpers/bases-locales'

import {getBalAccess} from '../lib/tokens'
import {getBaseLocale} from '../lib/bal-api'

import BasesLocalesList from './bases-locales-list'

function UserBasesLocales() {
  const [basesLocales, setBasesLocales] = useState([])

  useEffect(() => {
    const balAccess = getBalAccess()
    const getUserBals = async () => {
      const basesLocales = await Promise.all(
        map(balAccess, async (token, id) => {
          try {
            return await getBaseLocale(id, token)
          } catch (error) {
            console.log(`Impossible de récupérer la bal ${id}`)
          }
        }))

      await expandWithPublished(basesLocales)

      setBasesLocales(basesLocales)
    }

    if (balAccess) {
      getUserBals()
    }
  }, [])

  if (basesLocales.length === 0) {
    return null
  }

  return (
    <Pane flex={2}>
      <Heading padding={16} size={400}>Mes Bases Adresse Locales</Heading>
      <BasesLocalesList basesLocales={basesLocales} />
    </Pane>
  )
}

export default UserBasesLocales
