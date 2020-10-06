import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Badge, Card, Pane, Button, Tooltip, Icon, Text} from 'evergreen-ui'
import {formatDistanceToNow, format} from 'date-fns'
import {fr} from 'date-fns/locale'
import {getCommune} from '../../lib/geo-api'

function getBadge(status) {
  switch (status) {
    case 'published':
      return {color: 'green', label: 'Publiée'}
    case 'ready-to-publish':
      return {color: 'blue', label: 'Prête à être publiée'}
    default:
      return {color: 'neutral', label: 'Brouillon'}
  }
}

const BaseLocaleCard = ({baseLocale, editable, onSelect, onRemove}) => {
  const {nom, communes, status, _updated, _created, emails} = baseLocale
  const [nomCommune, setNomCommune] = useState()
  const [openInfo, setOpenInfo] = useState()
  const badge = getBadge(status)

  const handleOpenInfo = () => {
    setOpenInfo(!openInfo)
  }

  useEffect(() => {
    const fetchNomCommune = async code => {
      setNomCommune(await getCommune(code))
    }

    fetchNomCommune(communes[0])
  }, [communes])

  return (
    <Card
      border
      elevation={2}
      margin={8}
      padding={12}
      fontFamily='Helvetica Neue'
      display='grid'
      gridTemplateColumn='repeat(1fr)'
      background='tint1'
    >
      <Pane padding='.5em' display='flex' justifyContent='space-between' cursor='pointer' onClick={handleOpenInfo}>
        <Pane>
          <Pane display='flex' flexDirection='row' justifyContent='start'>
            <Icon icon='globe' marginRight='.5em' marginY='auto' />
            <Pane fontSize='18px'>{nom}</Pane>
          </Pane>
          <Text fontSize='12px' fontStyle='italic'>{_updated ? 'Dernière mise à jour il y a ' + formatDistanceToNow(new Date(_updated), {locale: fr}) : 'Jamais mise à jour'} - </Text>
          {nomCommune && communes.length < 2 ? (
            <Text fontSize='12px' fontStyle='italic'>{nomCommune.nom} ({nomCommune.codeDepartement}) </Text>
          ) : (
            <Text fontSize='12px' fontStyle='italic'>{communes.length} Communes</Text>
          )}
        </Pane>
        <Pane display='flex' flexDirection='row' justifyContent='space-between'>
          <Badge color={badge.color} margin='auto'>{badge.label}</Badge>
          <Icon icon={openInfo ? 'caret-down' : 'caret-right'} size={25} marginX='1em' marginY='auto' />
        </Pane>
      </Pane>

      {openInfo && (
        <>
          <Pane borderTop flex={3} display='flex' flexDirection='row' paddingTop='1em'>
            <Pane flex={1} textAlign='center' margin='auto'>
              <Pane>Créée le <Pane><b>{format(new Date(_created), 'PPP', {locale: fr})}</b></Pane></Pane>
            </Pane>

            {emails && editable && (
              <Pane flex={1} textAlign='center' padding='8px' display='flex' flexDirection='row' justifyContent='center' margin='auto'>
                {emails.length < 2 ? emails.length + ' Administrateur' : emails.length + ' Administrateurs'}
                <Tooltip
                  content={
                    emails.map(email => (
                      <Pane key={email} fontFamily='Helvetica Neue' padding='.5em'>
                        <Icon icon='user' marginRight='.5em' style={{verticalAlign: 'middle'}} />
                        {email}
                      </Pane>
                    ))
                  }
                  appearance='card'
                >
                  <Icon icon='info-sign' marginY='auto' marginX='.5em' />
                </Tooltip>
              </Pane>
            )}
            {!emails && editable && (
              <Pane flex={1} display='flex' flexDirection='row' justifyContent='center' marginY='auto' textAlign='center'>
                <Text><small><i>Pas d’administrateur<br /> pour les BAL de démonstration</i></small></Text>
              </Pane>
            )}
          </Pane>

          {editable && (
            <Pane borderTop display='flex' justifyContent='space-between' paddingTop='1em' marginTop='1em'>
              {status === 'draft' ? (
                <Button iconAfter='trash' intent='danger' onClick={onRemove}>Supprimer</Button>
              ) : (
                <Tooltip content='Vous ne pouvez pas supprimer une BAL losrqu‘elle est prête à être publiée'>
                  <Button isActive iconAfter='trash' >Supprimer</Button>
                </Tooltip>
              )}
              <Button appearance='primary' iconAfter='edit' marginRight='8px' onClick={onSelect}>Gérer les adresses</Button>
            </Pane>
          )}

        </>
      )}

    </Card>
  )
}

BaseLocaleCard.defaultProps = {
  editable: false,
  onRemove: null
}

BaseLocaleCard.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    communes: PropTypes.array.isRequired,
    emails: PropTypes.array,
    _updated: PropTypes.string,
    _created: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.oneOf([
      'draft', 'ready-to-publish', 'published'
    ])
  }).isRequired,
  editable: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func

}

export default BaseLocaleCard
