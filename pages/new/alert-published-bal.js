import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Dialog, Text, Alert} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import BaseLocaleCard from '../../components/bases-locales-list/base-locale-card'

const AlertPublishedBAL = ({isShown, onClose, onConfirm, existingBALs}) => {
  const [commune, setCommune] = useState(null)

  useEffect(() => {
    const fetchCommune = async code => {
      setCommune(await getCommune(code))
    }

    fetchCommune(existingBALs[0].communes[0])
  }, [existingBALs])

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
        title={existingBALs.length > 1 ? (
          'Vous avez déjà des Bases Adresses Locales existantes'
        ) : (
          'Vous avez déjà publié une Base Adresse Locale pour cette commune'
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
            {existingBALs.length > 1 ? (
              <>
                <Text>
                  Des Bases Adresses Locales correpondantes existent dans notre base de données.
                </Text>
                <br />
                <Text>
                  Vous pouvez reprendre votre travail sur une de ces Bases Adresses Locales en cliquant sur &quot;Gérer mes adresses&quot; ou choisir d’en créer une nouvelle.
                </Text>
                <br />
                <Text>
                  Nous vous <u>recommandons</u> toutefois de continuer l’adressage sur une de vos Bases Adresses Locales déjà existantes.
                </Text>
              </>
            ) : (
              <>
                <Text>
                  Une Base Adresse Locale de la commune de <b>{commune?.nom} </b>a déjà été crée.
                </Text>
                <br />
                <Text>
                  Vous pouvez reprendre votre travail sur cette Base Adresse Locale en cliquant sur &quot;Gérer mes adresses&quot; ou choisir d’en créer une nouvelle.
                </Text>
                <br />
                <Text>
                  Nous vous <u>recommandons</u> toutefois de continuer l’adressage sur la Base Adresse Locale déjà existante.
                </Text>
              </>
            )}
          </Alert>
          {existingBALs.length > 0 && (
            existingBALs.map(bal => {
              return (
                <BaseLocaleCard
                  key={bal._id}
                  initialIsOpen
                  editable={existingBALs.length > 0}
                  baseLocale={bal}
                  onSelect={() => onBalSelect(bal)}
                />
              )
            })
          )}
        </Pane>
      </Dialog>
    </>
  )
}

AlertPublishedBAL.propTypes = {
  isShown: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  existingBALs: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired
}

AlertPublishedBAL.defaultProps = {
  isShown: false
}

export default AlertPublishedBAL
