import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Dialog, Paragraph, Link} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import BaseLocaleCard from '../../components/bases-locales-list/base-locale-card'
import RecoverBALAlert from '../../components/recover-bal-alert'

const AlertPublishedBAL = ({isShown, onClose, alreadyPublishedBAL, createNewBal}) => {
  const [title, setTitle] = useState()
  const [paragraph, setParagraph] = useState()
  const [commune, setCommune] = useState()

  useEffect(() => {
    const fetchCommune = async code => {
      if (alreadyPublishedBAL.communes.length > 0) {
        setCommune(await getCommune(code))
      }
    }

    fetchCommune(alreadyPublishedBAL.communes[0])
  }, [alreadyPublishedBAL])

  useEffect(() => {
    if (alreadyPublishedBAL) {
      if (alreadyPublishedBAL.isOwner) {
        setTitle('Vous avez déjà publié une Base Adresse Locale pour cette commune')
        setParagraph('Souhaitez-vous poursuivre votre travail sur cette Base Adresse Locale ?')
      } else {
        setTitle('Une Base Adresse Locale de cette commune a déjà été publiée')
        setParagraph('Souhaitez-vous vraiment en créer une nouvelle ?')
      }
    } else {
      createNewBal()
    }
  }, [alreadyPublishedBAL, createNewBal])

  const onBalSelect = useCallback(bal => {
    if (bal.communes.length === 1) {
      Router.push(
        `/bal/commune?balId=${bal._id}&codeCommune=${bal.communes[0]}`,
        `/bal/${bal._id}/communes/${bal.communes[0]}`
      )
    } else {
      Router.push(`/bal?balId=${bal._id}`, `/bal/${bal._id}`)
    }
  }, [])

  return (
    <Dialog
      isShown={isShown}
      title={title}
      width='800px'
      hasFooter={false}
      onCloseComplete={onClose}
    >
      <Pane>
        <Paragraph paddingY='2em' textAlign='center'>{paragraph}</Paragraph>
        <BaseLocaleCard
          initialIsOpen
          editable={alreadyPublishedBAL?.isOwner}
          baseLocale={alreadyPublishedBAL}
          onSelect={() => onBalSelect(alreadyPublishedBAL)}
        />
        {alreadyPublishedBAL?.isOwner && (
          <Pane paddingTop='1em'>
            <RecoverBALAlert />
          </Pane>
        )}
        <Pane paddingY='3em' textAlign='center'>
          <Paragraph>Je veux <Link onClick={createNewBal} ><u>créer une nouvelle Base Adresse Locale</u><br /></Link> pour la commune de <b>{commune?.nom}</b></Paragraph>
        </Pane>
      </Pane>
    </Dialog>
  )
}

AlertPublishedBAL.propTypes = {
  isShown: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  alreadyPublishedBAL: PropTypes.object.isRequired,
  createNewBal: PropTypes.func.isRequired
}

AlertPublishedBAL.defaultProps = {
  isShown: false
}

export default AlertPublishedBAL
