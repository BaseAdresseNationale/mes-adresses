import React, {useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Menu, CogIcon, Dialog, Paragraph, Strong} from 'evergreen-ui'

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
      confirmLabel='Certifier toutes les adresses de la BAL'
      cancelLabel='Je souhaite d’abord vérifier mes adresses'
      onConfirm={() => handleConfirmation(true)}
      onCloseComplete={() => handleConfirmation(false)}
    >
      <Paragraph>
        Pour <Strong>renforcer la qualité des adresses</Strong>, la certification évolue. Sur les Bases Adresses Locales nouvellement créées, la certification <Strong>n’est plus affectée automatiquement à l’ensemble des adresses</Strong>, mais aux seules <Strong>adresses que la commune authentifie</Strong>.
      </Paragraph>

      <Paragraph paddingTop={16}>
        Si la totalité de vos adresses <Strong>ont déjà été vérifiées</Strong> lors de votre précédente publication, vous pouvez <Strong>certifier dès maitenant vos adresses</Strong>.
      </Paragraph>

      <Paragraph paddingTop={16}>
        Dans le cas contraire, il vous est possible de <Strong>vérifier vos adresses</Strong> et de les certifier à votre rythme.
        <Pane display='flex' alignItems='center'>
          Notez qu’il est possible de <Strong marginX={4}>certifier la totalité</Strong> de vos adresses depuis le menu
          <Menu.Item icon={CogIcon} paddingX={0}>
            Paramètres
          </Menu.Item>
        </Pane>
      </Paragraph>
    </Dialog>
  )
}

CertificationMessage.propTypes = {
  balId: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired
}

export default CertificationMessage
