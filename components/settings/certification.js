import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Dialog, Button, EndorsedIcon} from 'evergreen-ui'

import BalDataContext from '@/contexts/bal-data'

import CertificationCount from '@/components/certification-count'

function Certification({nbNumeros, nbNumerosCertifies, onSubmit}) {
  const {certifyAllNumeros} = useContext(BalDataContext)

  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCertification = async () => {
    setIsShown(false)
    setIsLoading(true)
    await certifyAllNumeros()

    if (onSubmit) {
      onSubmit()
    }

    setIsLoading(false)
  }

  return (
    <Pane display='flex' alignItems='baseline'>
      <Dialog
        isShown={isShown}
        title='Certifier toutes les adresses'
        confirmLabel='Certifier toutes les adresses'
        intent='success'
        cancelLabel='Annuler'
        onConfirm={handleCertification}
        onCloseComplete={() => setIsShown(false)}
      >
        Attention, vous vous apprêtez à certifier toutes les adresses de la commune. Nous vous recommandons de ne le faire que si toutes vos adresses sont vérifiées.
      </Dialog>

      <CertificationCount nbNumeros={nbNumeros} nbNumerosCertifies={nbNumerosCertifies} />

      <Button
        disabled={nbNumeros === nbNumerosCertifies}
        isLoading={isLoading}
        appearance='primary'
        intent='success'
        marginTop={16}
        marginLeft={8}
        iconAfter={EndorsedIcon}
        onClick={() => setIsShown(true)}
      >
        Certifier toutes les adresses
      </Button>
    </Pane>
  )
}

Certification.defaultProps = {
  onSubmit: null
}

Certification.propTypes = {
  nbNumeros: PropTypes.number.isRequired,
  nbNumerosCertifies: PropTypes.number.isRequired,
  onSubmit: PropTypes.func
}

export default Certification
