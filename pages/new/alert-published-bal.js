import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {uniq} from 'lodash'
import {Pane, Dialog, Alert, Paragraph, Strong} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import BaseLocaleCard from '../../components/bases-locales-list/base-locale-card'

const AlertPublishedBAL = ({isShown, onClose, onConfirm, basesLocales}) => {
  const [communeLabel, setCommuneLabel] = useState('cette commune')
  const uniqCommunes = uniq(...basesLocales.map(({communes}) => communes))

  useEffect(() => {
    const fetchCommune = async code => {
      const commune = await getCommune(code)
      if (commune) {
        setCommuneLabel(commune.nom)
      }
    }

    fetchCommune(basesLocales[0].communes[0])
  }, [basesLocales])

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
        title={uniqCommunes.length > 1 ? (
          'Vous avez déjà des Bases Adresses Locales pour ces communes'
        ) : (
          `Vous avez déjà créé une Base Adresse Locale pour ${communeLabel}`
        )}
        width='800px'
        confirmLabel='Créer une nouvelle Base Adresse Locale'
        cancelLabel='Annuler'
        onConfirm={onConfirm}
        onCloseComplete={onClose}
      >
        <Pane>
          <Alert margin='1em'>
            <Paragraph marginTop={8}>
              {uniqCommunes.length > 1 ? (
                <>Il semblerait que vous ayez <Strong>déjà créé</Strong> des Bases Adresses Locales pour ces communes.</>
              ) : (
                <>Une Base Adresse Locale a déjà été créée pour <Strong>{communeLabel}</Strong>.</>
              )}
            </Paragraph>
            <Paragraph marginTop={8}>
              {basesLocales.length > 1 ? (
                <>Nous vous <Strong>recommandons de continuer l’adressage</Strong> sur une de vos Bases Adresses Locales <Strong>déjà existantes</Strong> parmi la liste ci-dessous.</>
              ) : (
                <>Nous vous <Strong>recommandons de continuer l’adressage</Strong> sur votre Base Adresses Locales <Strong>déjà existante</Strong> ci-dessous.</>
              )}
            </Paragraph>
            <Paragraph marginTop={8}>
              Pour reprendre votre travail, {basesLocales.length > 1 && <><Strong>sélectionnez une Base Adresse Locale</Strong> puis</>} <Strong>cliquez sur &quot;Gérer&nbsp;mes&nbsp;adresses&quot;</Strong>.
            </Paragraph>
            <Paragraph marginTop={8}>
              Vous pouvez toutefois cliquer sur <Strong>&quot;Créer&nbsp;une&nbsp;nouvelle&nbsp;Base&nbsp;Adresses&nbsp;Locales&quot;</Strong> si vous souhaitez <Strong>recommencer l’adressage</Strong>.
            </Paragraph>
          </Alert>

          {basesLocales.map(bal => (
            <BaseLocaleCard
              key={bal._id}
              isAdmin
              initialIsOpen={basesLocales.length === 1}
              baseLocale={bal}
              onSelect={() => onBalSelect(bal)}
            />
          ))}
        </Pane>
      </Dialog>
    </>
  )
}

AlertPublishedBAL.propTypes = {
  isShown: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  basesLocales: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired
}

AlertPublishedBAL.defaultProps = {
  isShown: false
}

export default AlertPublishedBAL