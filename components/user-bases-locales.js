import {useState, useEffect, useContext, useCallback} from 'react'
import {Pane, Spinner, Button, PlusIcon, Heading} from 'evergreen-ui'
import {map} from 'lodash'

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
          return await getBaseLocale(id, token)
        } catch {
          console.log(`Impossible de récupérer la bal ${id}`)
        }
      }))

    const findedBasesLocales = basesLocales.filter(bal => Boolean(bal))

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
          <Button is='a' href='/new?demo=1'>Essayer l’outil</Button>
        </Pane>
      </>
    ) : (
      <Pane display='flex' flexDirection='column' justifyContent='center' alignItems='center' margin='auto'>
        <link href='/new' passHref>
          <Button
            marginBottom={12}
            height={40}
            appearance='primary'
            iconBefore={PlusIcon}
            is='a'
          >
            Créer une Base Adresse Locale
          </Button>
        </link>
        <Heading marginBottom={8}>Vous voulez simplement essayer l’éditeur sans créer de Base Adresse Locale ?</Heading>
        <Button is='a' href='/new?demo=1'>Essayer l’outil</Button>
      </Pane>
    )
  )
}

export default UserBasesLocales

