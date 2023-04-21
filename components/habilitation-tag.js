import React from 'react'
import PropTypes from 'prop-types'
import NextImage from 'next/image'
import {Pane, Tooltip} from 'evergreen-ui'

function HabilitationTag({communeName, isHabilitationValid}) {
  const tag = (
    <Pane position='relative' width={24} height={24}
      {...(isHabilitationValid && {cursor: 'pointer'})}
    >
      <NextImage
        src={isHabilitationValid ? '/static/images/bal-logo.png' : '/static/images/bal-logo-disabled.png'}
        alt='Logo Base Adresse Locale'
        layout='fill'
      />
    </Pane>
  )
  return (isHabilitationValid ? <Tooltip content={`Base Adresse Locale administrée par la commune de ${communeName}`}>{tag}</Tooltip> : tag
  )
}

HabilitationTag.propTypes = {
  communeName: PropTypes.string.isRequired,
  isHabilitationValid: PropTypes.bool.isRequired
}

export default React.memo(HabilitationTag)
