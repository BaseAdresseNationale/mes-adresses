import React, {useCallback, useState} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Heading, Icon, Pane} from 'evergreen-ui'

import BaseLocaleCard from '../bases-locales-list/base-locale-card'

function CommuneBALList({nomCommune, basesLocales}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleIsOpen = () => {
    setIsOpen(!isOpen)
  }

  const onBalSelect = useCallback(bal => {
    if (bal.communes.length === 1) {
      Router.push(
        `/bal/commune?balId=${bal._id}&codeCommune=${bal.communes[0]}`,
        `/bal/${bal._id}/communes/${bal.communes[0]}`,
      )
    } else {
      Router.push(`/bal?balId=${bal._id}`, `/bal/${bal._id}`)
    }
  }, [])

  return (
    <Pane>
      <Pane
        padding={8}
        display={isOpen ? '' : 'flex'}
        justifyContent={isOpen ? '' : 'space-between'}
        cursor='pointer'
        onClick={handleIsOpen}
      >
        <Pane
          display='flex'
          alignItems='center'
        >
          <Icon icon={isOpen ? 'chevron-down' : 'chevron-right'} size={30} marginY='auto' />
          <Heading size={600}>
            {nomCommune}
          </Heading>
        </Pane>

        {!isOpen && (
          <Heading size={600}>
            {`${basesLocales.length > 1 ? `${basesLocales.length} Bases Adresses Locales` : `${basesLocales.length} Base Adresse Locale`}`}
          </Heading>
        )}

      </Pane>
      {isOpen && (
        <Pane>
          {basesLocales.map(bal => (
            <BaseLocaleCard
              key={bal._id}
              baseLocale={bal}
              onSelect={() => onBalSelect(bal)}
            />
          ))}
        </Pane>
      )}
    </Pane>
  )
}

CommuneBALList.propTypes = {
  nomCommune: PropTypes.string.isRequired,
  basesLocales: PropTypes.array.isRequired,
}

export default CommuneBALList
