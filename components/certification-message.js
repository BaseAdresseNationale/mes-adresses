import React, {useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Button, Dialog, Pane, Paragraph} from 'evergreen-ui'

import TokenContext from '../contexts/token'

import {getCommuneWithCount, certifyBAL} from '../lib/bal-api'

const CERTIF_AUTO_KEY = 'certificationAutoAlert'

const CertificationMessage = ({balId, codeCommune}) => {
  const [isShown, setIsShown] = useState(false)
  const {token} = useContext(TokenContext)

  const handleConfirmation = async certifAuto => {
    if (certifAuto) {
      await certifyBAL(balId, codeCommune, token, {certifie: true})
    }

    localStorage.setItem(CERTIF_AUTO_KEY, true)
    setIsShown(false)
  }

  useEffect(() => {
    const checkCertifiateAdresses = async () => {
      const wasInformed = JSON.parse(localStorage.getItem(CERTIF_AUTO_KEY) || false)

      if (!wasInformed && balId && codeCommune) {
        const {nbNumerosCertifies} = await getCommuneWithCount(balId, codeCommune)

        if (nbNumerosCertifies === 0) {
          setIsShown(true)
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
