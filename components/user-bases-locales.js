import React, {useState, useEffect} from 'react'
import Router from 'next/router'
import {Pane, Spinner, Button, PlusIcon} from 'evergreen-ui'
import {map} from 'lodash'

import {expandWithPublished} from '../helpers/bases-locales'

import {getBalAccess} from '../lib/tokens'
import {getBaseLocale} from '../lib/bal-api'

import BasesLocalesList from './bases-locales-list'

function UserBasesLocales() {
  const [basesLocales, setBasesLocales] = useState(null)
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

  if (!basesLocales) {
    return (
      <Pane display='flex' alignItems='center' justifyContent='center' flex={1}>
        <Spinner />
      </Pane>
    )
  }

  return (
    <>
      {basesLocales.length > 0 ? (
        <BasesLocalesList basesLocales={basesLocales} updateBasesLocales={setBalAccess} />
      ) : (
        <Pane display='flex' flexDirection='column' justifyContent='center' alignItems='center' margin='auto'>
          <Button
            marginBottom={12}
            height={40}
            appearance='primary'
            iconBefore={PlusIcon}
            onClick={() => Router.push('/new')}
          >
            Créer une Base Adresse Locale
          </Button>
          <Button onClick={() => Router.push('/new?demo=1')}>Essayer l’outil</Button>
        </Pane>
      )}
    </>
  )
}

export default UserBasesLocales
