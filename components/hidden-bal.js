import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Text, PlusIcon, MinusIcon, UndoIcon} from 'evergreen-ui'

import LocalStorageContext from '../contexts/local-storage'

import BaseLocaleCard from './base-locale-card'

function HiddenBal({basesLocales}) {
  const [isWrapped, setIsWrapped] = useState(true)
  const {removeHiddenBal} = useContext(LocalStorageContext)

  return (
    <Pane display='flex' flexDirection='column' justifyContent='center'>
      <Pane
        display='flex'
        justifyContent='center'
        alignItem='center'
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
      )}
    </Pane>
  )
}

HiddenBal.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default HiddenBal
