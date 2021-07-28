import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Dialog, Pane, Paragraph} from 'evergreen-ui'

import {getNumeros} from '../lib/bal-api'

const CERTIF_AUTO_KEY = 'certificationAutoAlert'

const CertificationMessage = ({voies}) => {
  const [isShown, setIsShown] = useState(false)

  const handleConfirmation = certifAuto => {
    if (certifAuto) {
      console.log('let’s batch !')
    }

    localStorage.setItem(CERTIF_AUTO_KEY, true)
    setIsShown(false)
  }

  useEffect(() => {
    const checkCertifiateAdresses = async () => {
      const wasInformed = JSON.parse(localStorage.getItem(CERTIF_AUTO_KEY) || false)
      const wasWelcomed = JSON.parse(localStorage.getItem('was-welcomed') || false)

      if (!wasInformed && wasWelcomed) {
        const allCertifiedNumeros = []

        await Promise.all(voies.map(async voie => {
          const numeros = await getNumeros(voie._id)
          const certifiedNumeros = numeros.filter(n => n.certifie)

          certifiedNumeros.forEach(numero => {
            allCertifiedNumeros.push(numero)
          })
        }))

        if (allCertifiedNumeros.length === 0) {
          setIsShown(true)
        }
      }
    }

    checkCertifiateAdresses()
  }, [voies])

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
  voies: PropTypes.array
}

CertificationMessage.defaultProps = {
  voies: null
}

export default CertificationMessage
