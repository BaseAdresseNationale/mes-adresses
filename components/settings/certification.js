import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, EndorsedIcon} from 'evergreen-ui'

import BalDataContext from '../../contexts/bal-data'

import CertificationCount from '../certification-count'

function Certification({nbNumeros, nbNumerosCertifies}) {
  const {certifyAllNumeros} = useContext(BalDataContext)

  const [isLoading, setIsLoading] = useState(false)

  const handleCertification = async () => {
    setIsLoading(true)
    await certifyAllNumeros()
    setIsLoading(false)
  }

  return (
    <Pane display='flex' alignItems='baseline'>
      <CertificationCount nbNumeros={nbNumeros} nbNumerosCertifies={nbNumerosCertifies} />

      <Button
        disabled={nbNumeros === nbNumerosCertifies}
        isLoading={isLoading}
        appearance='primary'
        intent='success'
        marginTop={16}
        marginLeft={8}
        iconAfter={EndorsedIcon}
        onClick={handleCertification}
      >
        Certifier toutes les adresses
      </Button>
    </Pane>
  )
}

Certification.propTypes = {
  nbNumeros: PropTypes.number.isRequired,
  nbNumerosCertifies: PropTypes.number.isRequired
}

export default Certification
