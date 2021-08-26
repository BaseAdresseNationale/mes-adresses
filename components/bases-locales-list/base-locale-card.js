import React, {useState, useEffect, useMemo, useContext} from 'react'
import PropTypes from 'prop-types'
import {
  Heading,
  Badge,
  Card,
  Pane,
  Button,
  Tooltip,
  Text,
  GlobeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  UserIcon,
  InfoSignIcon,
  TrashIcon,
  EditIcon,
  KeyIcon
} from 'evergreen-ui'
import {formatDistanceToNow, format} from 'date-fns'
import {fr} from 'date-fns/locale'

import {colors} from '../../lib/colors'

import {getCommune} from '../../lib/geo-api'

import LocalStorageContext from '../../contexts/local-storage'

import RecoverBALAlert from '../bal-recovery/recover-bal-alert'

function getBadge({status, published}) {
  if (published) {
    return {color: 'green', label: 'Publiée'}
  }

  switch (status) {
    case 'published':
      return {color: 'green', label: 'Publiée'}
    case 'ready-to-publish':
      return {color: 'blue', label: 'Prête à être publiée'}
    default:
      return {color: 'neutral', label: 'Brouillon'}
  }
}

const BaseLocaleCard = ({baseLocale, isAdmin, userEmail, initialIsOpen, onSelect, onRemove}) => {
  const {getBalToken} = useContext(LocalStorageContext)

  const {nom, communes, status, _updated, _created, emails} = baseLocale
  const [commune, setCommune] = useState()
  const [isOpen, setIsOpen] = useState(isAdmin ? initialIsOpen : false)
  const [isBALRecoveryShown, setIsBALRecoveryShown] = useState(false)

  const majDate = formatDistanceToNow(new Date(_updated), {locale: fr})
  const createDate = format(new Date(_created), 'PPP', {locale: fr})
  const badge = getBadge(baseLocale)

  const handleIsOpen = () => {
    setIsOpen(!isOpen)
  }

  const hasToken = useMemo(() => {
    return Boolean(getBalToken(baseLocale._id))
  }, [baseLocale, getBalToken])

  useEffect(() => {
    const fetchCommune = async code => {
      if (communes.length > 0) {
        setCommune(await getCommune(code))
      }
    }

    fetchCommune(communes[0])
  }, [communes])

  return (
    <Card
      border
      elevation={2}
      margin={10}
      padding={12}
      display='grid'
      gridTemplateColumns='repeat(1fr)'
      background={baseLocale.status === 'demo' ? '#E4E7EB' : 'tint1'}
    >
      <Pane
        padding='.5em'
        display='flex'
        justifyContent='space-between'
        cursor='pointer'
        onClick={handleIsOpen}
      >
        <Pane>
          <Pane display='flex' flexDirection='row' justifyContent='start'>
            <GlobeIcon marginRight='.5em' marginY='auto' />
            <Heading fontSize='18px'>{nom}</Heading>
          </Pane>
          <Text fontSize='12px' fontStyle='italic'>
            {_updated ? 'Dernière mise à jour il y a ' + majDate : 'Jamais mise à jour'} -{' '}
          </Text>
          {communes.length === 0 ? (
            <Text fontSize='12px' fontStyle='italic'>
              Vide
            </Text>
          ) : communes.length < 2 ? (
            commune && (
              <Text fontSize='12px' fontStyle='italic'>
                {commune.nom} ({commune.codeDepartement}){' '}
              </Text>
            )
          ) : (
            <Text fontSize='12px' fontStyle='italic'>
              {communes.length} Communes
            </Text>
          )}
        </Pane>
        <Pane display='flex' flexDirection='row' justifyContent='space-between'>
          {baseLocale.status === 'demo' ? (
            <Badge color={colors.neutral} margin='auto'>
              DÉMO
            </Badge>
          ) : (
            <Badge color={badge.color} margin='auto'>
              {badge.label}
            </Badge>
          )}
          {isOpen ? (
            <ChevronDownIcon size={25} marginX='1em' marginY='auto' />
          ) : (
            <ChevronRightIcon size={25} marginX='1em' marginY='auto' />
          )}
        </Pane>
      </Pane>

      {isOpen && (
        <>
          <Pane borderTop flex={3} display='flex' flexDirection='row' paddingTop='1em'>
            <Pane flex={1} textAlign='center' margin='auto'>
              <Text>
                Créée le{' '}
                <Pane>
                  <b>{createDate}</b>
                </Pane>
              </Text>
            </Pane>

            {emails && isAdmin && (
              <Pane
                flex={1}
                textAlign='center'
                padding='8px'
                display='flex'
                flexDirection='row'
                justifyContent='center'
                margin='auto'
              >
                <Text>
                  {emails.length < 2 ? '1 Administrateur' : emails.length + ' Administrateurs'}
                </Text>
                <Tooltip
                  content={emails.map(email => (
                    <Pane key={email} fontFamily='Helvetica Neue' padding='.5em'>
                      <UserIcon marginRight='.5em' style={{verticalAlign: 'middle'}} />
                      {email}
                    </Pane>
                  ))}
                  appearance='card'
                >
                  <InfoSignIcon marginY='auto' marginX='.5em' />
                </Tooltip>
              </Pane>
            )}
            {isAdmin && status === 'demo' && (
              <Pane
                flex={1}
                display='flex'
                flexDirection='row'
                justifyContent='center'
                marginY='auto'
                textAlign='center'
              >
                <Text>
                  <small>
                    <i>
                      Pas d’administrateur
                      <br /> pour les BAL de démonstration
                    </i>
                  </small>
                </Text>
              </Pane>
            )}
          </Pane>

          {isAdmin ? (
            <Pane
              borderTop
              display='flex'
              justifyContent='space-between'
              paddingTop='1em'
              marginTop='1em'
            >
              {status === 'draft' || status === 'demo' ? (
                <Button
                  iconAfter={TrashIcon}
                  intent='danger'
                  disabled={!onRemove || !hasToken}
                  onClick={onRemove}
                >
                  Supprimer
                </Button>
              ) : (
                <Tooltip content='Vous ne pouvez pas supprimer une BAL losrqu‘elle est prête à être publiée'>
                  <Button isActive iconAfter={TrashIcon}>
                    Supprimer
                  </Button>
                </Tooltip>
              )}
              {hasToken ? (
                <Button
                  appearance='primary'
                  iconAfter={EditIcon}
                  marginRight='8px'
                  onClick={onSelect}
                >
                  Gérer les adresses
                </Button>
              ) : (
                <>
                  <RecoverBALAlert
                    isShown={isBALRecoveryShown}
                    defaultEmail={userEmail}
                    baseLocaleId={baseLocale._id}
                    onClose={() => setIsBALRecoveryShown(false)}
                  />
                  <Button
                    iconAfter={KeyIcon}
                    marginRight='8px'
                    onClick={() => setIsBALRecoveryShown(true)}
                  >
                    Récupérer l’accès
                  </Button>
                </>
              )}
            </Pane>
          ) : (
            <Pane
              borderTop
              display='flex'
              justifyContent='flex-end'
              paddingTop='1em'
              marginTop='1em'
            >
              <Button appearance='primary' marginRight='8px' onClick={onSelect}>
                Consulter
              </Button>
            </Pane>
          )}
        </>
      )}
    </Card>
  )
}

BaseLocaleCard.defaultProps = {
  isAdmin: false,
  userEmail: null,
  onRemove: null,
  initialIsOpen: false
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
    status: PropTypes.oneOf(['draft', 'ready-to-publish', 'published', 'demo'])
  }).isRequired,
  initialIsOpen: PropTypes.bool,
  isAdmin: PropTypes.bool,
  userEmail: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func
}

export default BaseLocaleCard
