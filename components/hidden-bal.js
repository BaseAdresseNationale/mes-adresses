import {useState, useCallback, useEffect, useContext} from 'react'
import {Pane, Text, PlusIcon, MinusIcon, UndoIcon, Spinner} from 'evergreen-ui'
import {map, filter} from 'lodash'

import {getBaseLocale} from '@/lib/bal-api'

import LocalStorageContext from '@/contexts/local-storage'

import BaseLocaleCard from '@/components/base-locale-card'

function HiddenBal() {
  const [isWrapped, setIsWrapped] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [basesLocales, setBasesLocales] = useState(null)

  const {balAccess, getHiddenBal, removeHiddenBal} = useContext(LocalStorageContext)

  const getUserHiddenBals = useCallback(async () => {
    setIsLoading(true)
    const balsToLoad = filter(Object.keys(balAccess), id => getHiddenBal(id))
    const basesLocales = await Promise.all(
      map(balsToLoad, async id => {
        try {
          return await getBaseLocale(id, balAccess[id])
        } catch {
          console.log(`Impossible de récupérer la bal ${id}`)
        }
      }))

    const findedBasesLocales = basesLocales.filter(bal => Boolean(bal))

    setBasesLocales(findedBasesLocales)
    setIsLoading(false)
  }, [balAccess, getHiddenBal])

  useEffect(() => {
    // Fetch bases locales only once
    if (!isWrapped && !basesLocales) {
      getUserHiddenBals()
    }
  }, [isWrapped, basesLocales, getUserHiddenBals])

  return (
    <Pane display='flex' flexDirection='column' justifyContent='center'>
      <Pane
        display='flex'
        justifyContent='center'
        alignItems='center'
        cursor='pointer'
        textAlign='center'
        textDecoration='underline'
        marginY={16}
        onClick={() => setIsWrapped(!isWrapped)}
      >
        <Text marginRight={8}>{isWrapped ? 'Afficher' : 'Cacher'} vos Bases Adresses Locales masquées</Text>
        <Pane>{isWrapped ? (
          <PlusIcon style={{verticalAlign: 'middle'}} />
        ) : (
          <MinusIcon style={{verticalAlign: 'middle'}} />
        )}</Pane>

      </Pane>
      {!isWrapped && (
        isLoading ? (
          <Pane display='flex' alignItems='center' justifyContent='center' flex={1}>
            <Spinner />
          </Pane>
        ) : (
          <Pane background='#E4E7EB'>
            {basesLocales.map(bal => (
              <Pane key={bal._id} display='flex' alignItems='center'>
                <Pane flex={1}>
                  <BaseLocaleCard
                    isAdmin
                    baseLocale={bal}
                    isDefaultOpen={false}
                  />
                </Pane>
                <Pane
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                  cursor='pointer'
                  margin={16}
                  onClick={() => removeHiddenBal(bal._id)}
                >
                  <UndoIcon size={24} />
                  <Text size={300}>Ne plus masquer</Text>
                </Pane>
              </Pane>
            ))}
          </Pane>
        ))}
    </Pane>
  )
}

export default HiddenBal
