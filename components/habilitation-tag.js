import React from 'react'
import {Pane, Tooltip} from 'evergreen-ui'
import PropTypes from 'prop-types'
import NextImage from 'next/image'

function HabilitationTag({communeName}) {
  return (
    <Tooltip content={`Base Adresse Locale administrée par la commune de ${communeName}`}>
      <Pane position='relative' width={24} height={24} cursor='pointer'>
        <NextImage
          src='/static/images/bal-logo.png'
          alt='Logo Base Adresse Locale'
          layout='fill'
        />
      </Pane>
    </Tooltip>
  )
}

HabilitationTag.propTypes = {
  communeName: PropTypes.string.isRequired
}

export default React.memo(HabilitationTag)
