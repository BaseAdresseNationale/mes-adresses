import {useState, useEffect, useContext, useCallback} from 'react'
import Link from 'next/link'
import {map, filter} from 'lodash'
import {Pane, Spinner, Button, PlusIcon, Heading} from 'evergreen-ui'

import {getBaseLocale} from '@/lib/bal-api'

import LocalStorageContext from '@/contexts/local-storage'

import HiddenBal from '@/components/hidden-bal'
import BasesLocalesList from '@/components/bases-locales-list'

function UserBasesLocales() {
  const {balAccess, hiddenBal, getHiddenBal} = useContext(LocalStorageContext)

  const [isLoading, setIsLoading] = useState(true)
  const [basesLocales, setBasesLocales] = useState([])

  const getUserBals = useCallback(async () => {
    setIsLoading(true)

    if (balAccess) {
      const balsToLoad = filter(Object.keys(balAccess), id => !getHiddenBal(id))
      const basesLocales = await Promise.all(
        map(balsToLoad, async id => {
          const token = balAccess[id]
          try {
            return await getBaseLocale(id, token)
          } catch {
            console.log(`Impossible de récupérer la bal ${id}`)
          }
        }))

      const findedBasesLocales = basesLocales.filter(bal => Boolean(bal))
      setBasesLocales(findedBasesLocales)
    }

    setIsLoading(false)
  }, [balAccess, getHiddenBal])

  useEffect(() => {
    if (balAccess !== undefined) {
      getUserBals()
    }
  }, [balAccess, getUserBals])

  if (balAccess === undefined || isLoading) {
    return (
      <Pane display='flex' alignItems='center' justifyContent='center' flex={1}>
        <Spinner />
      </Pane>
    )
  }

  return (
    <Pane display='flex' flexDirection='column' flex={1} justifyContent='center'>
      {basesLocales.length > 0 ? (
        <BasesLocalesList basesLocales={basesLocales} />
      ) : (
        <Link href='/new' passHref legacyBehavior>
          <Button
            margin='auto'
            height={40}
            appearance='primary'
            iconBefore={PlusIcon}
            is='a'
          >
            Créer une Base Adresse Locale
          </Button>
        </Link>
      )}

      {hiddenBal && Object.keys(hiddenBal).length > 0 && (
        <HiddenBal />
      )}

      <Pane margin='auto' textAlign='center' marginTop={16}>
        <Heading marginBottom={8}>Vous voulez simplement essayer l’éditeur sans créer de Base Adresse Locale ?</Heading>
        <Link href='/new?demo=1' passHref legacyBehavior>
          <Button is='a'>Essayer l’outil</Button>
        </Link>
      </Pane>
    </Pane>
  )
}

export default UserBasesLocales

