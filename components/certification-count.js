import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip, Text, EndorsedIcon} from 'evergreen-ui'

function CertificationCount({nbNumeros, nbNumerosCertifies}) {
  return (
    <Tooltip content='Adresses certifiées par la commune'>
      <Text whiteSpace='nowrap'>{nbNumerosCertifies} / {nbNumeros} <EndorsedIcon color='success' style={{verticalAlign: 'sub'}} /></Text>
    </Tooltip>
  )
}

CertificationCount.propTypes = {
  nbNumeros: PropTypes.number.isRequired,
  nbNumerosCertifies: PropTypes.number.isRequired
}

export default CertificationCount
