import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Dialog, Text, Alert} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import BaseLocaleCard from '../../components/bases-locales-list/base-locale-card'

const AlertPublishedBAL = ({isShown, onClose, onConfirm, alreadyPublishedBAL}) => {
  const [commune, setCommune] = useState(null)

  useEffect(() => {
    const fetchCommune = async code => {
      setCommune(await getCommune(code))
    }

    if (alreadyPublishedBAL.length > 1) {
      fetchCommune(alreadyPublishedBAL[0].communes[0])
    } else {
      fetchCommune(alreadyPublishedBAL.communes[0])
    }
  }, [alreadyPublishedBAL])

  const onBalSelect = bal => {
    if (bal.communes.length === 1) {
      Router.push(
        `/bal/commune?balId=${bal._id}&codeCommune=${bal.communes[0]}`,
        `/bal/${bal._id}/communes/${bal.communes[0]}`
      )
    } else {
      Router.push(`/bal?balId=${bal._id}`, `/bal/${bal._id}`)
    }
  }

  return (
    <>
      <Dialog
        isShown={isShown}
        title={alreadyPublishedBAL.isOwner ? (
          'Vous avez déjà publié une Base Adresse Locale pour cette commune'
        ) : (
          'Une Base Adresse Locale a déjà été publiée pour cette commune'
        )}
        width='800px'
        intent='success'
        confirmLabel='Créer une nouvelle Base Adresse Locale'
        cancelLabel='Annuler'
        onConfirm={onConfirm}
        onCloseComplete={onClose}
      >
        <Pane>
          <Alert margin='1em'>
            <Text>
              Une Base Adresse Locale de la commune de <b>{commune?.nom} </b>a déjà été publiée.
            </Text>
            <br />
            <Text>
              Vous pouvez reprendre votre travail sur cette Base Adresse Locale en cliquant sur &quot;Gérer mes adresses&quot; ou choisir d’en créer une nouvelle.
            </Text>
            <br />
            <Text>
              Nous vous <u>recommandons</u> toutefois de continuer l’adressage sur la Base Adresse Locale déjà publiée.
            </Text>
          </Alert>
          {!alreadyPublishedBAL.length && (
            <BaseLocaleCard
              initialIsOpen
              editable={alreadyPublishedBAL?.isOwner}
              baseLocale={alreadyPublishedBAL}
              onSelect={() => onBalSelect(alreadyPublishedBAL)}
            />
          )}
        </Pane>
      </Dialog>
    </>
  )
}

AlertPublishedBAL.propTypes = {
  isShown: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  alreadyPublishedBAL: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired
}

AlertPublishedBAL.defaultProps = {
  isShown: false
}

export default AlertPublishedBAL
