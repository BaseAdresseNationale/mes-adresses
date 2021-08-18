import {useState, useEffect, useContext, useCallback} from 'react'
import Router from 'next/router'
import {Pane, Spinner, Button, PlusIcon, Heading} from 'evergreen-ui'
import {map} from 'lodash'

import {expandWithPublished} from '../helpers/bases-locales'

import {getBaseLocale} from '../lib/bal-api'

import LocalStorageContext from '../contexts/local-storage'

import BasesLocalesList from './bases-locales-list'

function UserBasesLocales() {
  const {balAccess} = useContext(LocalStorageContext)

  const [isLoading, setIsLoading] = useState(true)
  const [basesLocales, setBasesLocales] = useState([])

  const getUserBals = useCallback(async () => {
    setIsLoading(true)
    const basesLocales = await Promise.all(
      map(balAccess, async (token, id) => {
        try {
          return getBaseLocale(id, token)
        } catch {
          console.log(`Impossible de récupérer la bal ${id}`)
        }
      }))

    const findedBasesLocales = basesLocales.filter(bal => Boolean(bal))

    await expandWithPublished(findedBasesLocales)

    setBasesLocales(findedBasesLocales)
    setIsLoading(false)
  }, [balAccess])

  useEffect(() => {
    getUserBals()
  }, [balAccess, getUserBals])

  if (balAccess === undefined || isLoading) {
    return (
      <Pane display='flex' alignItems='center' justifyContent='center' flex={1}>
        <Spinner />
      </Pane>
    )
  }

  return (
    basesLocales.length > 0 ? (
      <>
        <BasesLocalesList basesLocales={basesLocales} />

        <Pane margin='auto' textAlign='center'>
          <Heading marginBottom={8}>Vous voulez simplement essayer l’éditeur sans créer de Base Adresse Locale ?</Heading>
          <Button onClick={() => Router.push('/new?demo=1')}>Essayer l’outil</Button>
        </Pane>
      </>
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
        <Heading marginBottom={8}>Vous voulez simplement essayer l’éditeur sans créer de Base Adresse Locale ?</Heading>
        <Button onClick={() => Router.push('/new?demo=1')}>Essayer l’outil</Button>
      </Pane>
    )
  )
}

export default UserBasesLocales
