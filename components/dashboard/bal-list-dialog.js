import {useCallback} from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import {Pane, Dialog} from 'evergreen-ui'

import BaseLocaleCard from '@/components/base-locale-card'

function BALListDialog({basesLocales, isShown, handleClose}) {
  const onBalSelect = useCallback(bal => {
    Router.push(
      `/bal?balId=${bal._id}`,
      `/bal/${bal._id}`
    )
  }, [])

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        width={900}
        title={`${basesLocales.length > 1 ? 'Bases adresses locales' : 'Base adresse locale'}`}
        onCloseComplete={handleClose}
        hasFooter={false}
      >
        <Pane>
          {basesLocales.map(bal => (
            <BaseLocaleCard
              key={bal._id}
              baseLocale={bal}
              onSelect={() => onBalSelect(bal)}
            />
          ))}
        </Pane>
      </Dialog>
    </Pane>
  )
}

BALListDialog.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  isShown: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default BALListDialog
