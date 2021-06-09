import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Dialog, Paragraph, Link} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import BaseLocaleCard from '../../components/bases-locales-list/base-locale-card'

const AlertPublishedBAL = ({isShown, onClose, onConfirm, alreadyPublishedBAL}) => {
  const [commune, setCommune] = useState(null)

  useEffect(() => {
    const fetchCommune = async code => {
      if (alreadyPublishedBAL.communes.length > 0) {
        setCommune(await getCommune(code))
      }
    }

    fetchCommune(alreadyPublishedBAL.communes[0])
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
    <Dialog
      isShown={isShown}
      title={alreadyPublishedBAL.isOwner ? (
        'Vous avez déjà publié une Base Adresse Locale pour cette commune'
      ) : (
        'Une Base Adresse Locale de cette commune a déjà été publiée'
      )}
      width='800px'
      hasFooter={false}
      onConfirm={onConfirm}
      onCloseComplete={onClose}
    >
      <Pane>
        <Paragraph paddingY='2em' textAlign='center'>
          {alreadyPublishedBAL.isOwner ? (
            'Souhaitez-vous poursuivre votre travail sur cette Base Adresse Locale ?'
          ) : (
            'Souhaitez-vous vraiment en créer une nouvelle ?'
          )}
        </Paragraph>
        <BaseLocaleCard
          initialIsOpen
          editable={alreadyPublishedBAL?.isOwner}
          baseLocale={alreadyPublishedBAL}
          onSelect={() => onBalSelect(alreadyPublishedBAL)}
        />
        <Pane paddingY='3em' textAlign='center'>
          <Paragraph>Je veux <Link cursor='pointer' onClick={onConfirm} ><u>créer une nouvelle Base Adresse Locale</u><br /></Link> pour la commune de <b>{commune?.nom}</b></Paragraph>
        </Pane>
      </Pane>
    </Dialog>
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
