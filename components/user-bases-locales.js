import React, {useState, useEffect} from 'react'
import {Pane, Heading} from 'evergreen-ui'
import {map} from 'lodash'

import {expandWithPublished} from '../helpers/bases-locales'

import {getBalAccess} from '../lib/tokens'
import {getBaseLocale} from '../lib/bal-api'

import BasesLocalesList from './bases-locales-list'

function UserBasesLocales() {
  const [basesLocales, setBasesLocales] = useState([])
  const [balAccess, setBalAccess] = useState(getBalAccess())

  useEffect(() => {
    const getUserBals = async () => {
      const basesLocales = await Promise.all(
        map(balAccess, async (token, id) => {
          try {
            return await getBaseLocale(id, token)
          } catch (error) {
            console.log(`Impossible de récupérer la bal ${id}`)
          }
        }))

      const findedBasesLocales = basesLocales.filter(bal => Boolean(bal))

      await expandWithPublished(findedBasesLocales)

      setBasesLocales(findedBasesLocales)
    }

    if (balAccess) {
      getUserBals()
    }
  }, [balAccess])

  if (basesLocales.length === 0) {
    return null
  }

  return (
    <Pane flex={2}>
      <Heading padding={16} size={400}>Mes Bases Adresse Locales</Heading>
      <BasesLocalesList basesLocales={basesLocales} updateBasesLocales={setBalAccess} />
    </Pane>
  )
}

export default UserBasesLocales
