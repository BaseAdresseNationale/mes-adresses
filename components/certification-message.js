import React, {useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Button, Dialog, Pane, Paragraph} from 'evergreen-ui'

import LocalStorageContext from '../contexts/local-storage'
import BalDataContext from '../contexts/bal-data'

import {getCommune} from '../lib/bal-api'

const CertificationMessage = ({balId, codeCommune}) => {
  const [isShown, setIsShown] = useState(false)

  const {getInformedAboutCertification, addInformedAboutCertification} = useContext(LocalStorageContext)
  const {certifyAllNumeros} = useContext(BalDataContext)

  const handleConfirmation = async certifAuto => {
    if (certifAuto) {
      await certifyAllNumeros()
    }

    addInformedAboutCertification(balId, true)
    setIsShown(false)
  }

  useEffect(() => {
    const checkCertifiateAdresses = async () => {
      const hasBeenAutocertified = getInformedAboutCertification(balId)

      if (!hasBeenAutocertified) {
        const {nbNumerosCertifies} = await getCommune(balId, codeCommune)

        if (nbNumerosCertifies === 0) {
          setIsShown(true)
        } else {
          addInformedAboutCertification(balId, true)
        }
      }
    }

    checkCertifiateAdresses()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog
      isShown={isShown}
      width={800}
      intent='success'
      title='Nouvelle fonctionnalité de certification'
      hasCancel={false}
      hasFooter={false}
      onCloseComplete={() => handleConfirmation(false)}
    >
      <Paragraph>
        Il est désormais possible d’indiquer pour chaque adresse si celle-ci est certifiée par la commune.
      </Paragraph>
      <Paragraph paddingTop={5}>
        Votre Base Adresse Locale étant d’ores et déjà publiée, <br />souhaitez-vous certifier automatiquement toutes les adresses de votre Base Adresse Locale ?
      </Paragraph>

      <Pane display='flex' justifyContent='center'>
        <Button
          type='button'
          appearance='primary'
          intent='success'
          marginY={16}
          marginX={8}
          onClick={() => handleConfirmation(true)}
        >
          Oui, certifier toutes les adresses de la BAL
        </Button>
        <Button
          type='button'
          appearance='default'
          marginY={16}
          marginX={8}
          onClick={() => handleConfirmation(false)}
        >
          Non, je souhaite certifier manuellement
        </Button>
      </Pane>

    </Dialog>
  )
}

CertificationMessage.propTypes = {
  balId: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired
}

export default CertificationMessage
