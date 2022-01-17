import {useState, useEffect, useMemo, useContext} from 'react'
import PropTypes from 'prop-types'
import {Heading, Badge, Card, Pane, Button, Tooltip, Text, ChevronRightIcon, ChevronDownIcon, UserIcon, InfoSignIcon, TrashIcon, EditIcon, KeyIcon} from 'evergreen-ui'
import {formatDistanceToNow, format} from 'date-fns'
import {fr} from 'date-fns/locale'

import {colors} from '../../lib/colors'

import {getCommune} from '../../lib/bal-api'
import {getCommune as getCommuneGeoData} from '../../lib/geo-api'

import LocalStorageContext from '../../contexts/local-storage'

import RecoverBALAlert from '../bal-recovery/recover-bal-alert'
import CertificationCount from '../certification-count'

const statusBadges = {
  published: {color: 'green', background: '#DCF2EA', label: 'Publiée'},
  'ready-to-publish': {color: 'blue', background: '#D6E0FF', label: 'Prête à être publiée'},
  draft: {color: 'neutral', background: '#edeff5', label: 'Brouillon'},
  demo: {color: colors.neutral, background: colors.neutral, label: 'Démonstration'}
}

function BaseLocaleCard({baseLocale, isAdmin, userEmail, isDefaultOpen, onSelect, onRemove}) {
  const {getBalToken} = useContext(LocalStorageContext)

  const {nom, communes, status, _updated, _created, emails} = baseLocale
  const [commune, setCommune] = useState()
  const [isOpen, setIsOpen] = useState(isAdmin ? isDefaultOpen : false)
  const [isBALRecoveryShown, setIsBALRecoveryShown] = useState(false)

  const isDeletable = status === 'draft' || status === 'demo'
  const tooltipContent = status === 'ready-to-publish' ? 'Vous ne pouvez pas supprimer une BAL lorsqu‘elle est prête à être publiée' : 'Vous ne pouvez pas supprimer une Base Adresse Locale qui est publiée. Si vous souhaitez la dé-publier, veuillez contacter le support adresse@data.gouv.fr'
  const majDate = formatDistanceToNow(new Date(_updated), {locale: fr})
  const createDate = format(new Date(_created), 'PPP', {locale: fr})
  const badge = statusBadges[baseLocale.status]

  const handleIsOpen = () => {
    setIsOpen(!isOpen)
  }

  const hasToken = useMemo(() => {
    return Boolean(getBalToken(baseLocale._id))
  }, [baseLocale, getBalToken])

  useEffect(() => {
    const fetchCommune = async code => {
      if (communes.length > 0) {
        const communeBal = await getCommune(baseLocale._id, code)
        const communeInfo = await getCommuneGeoData(code)
        setCommune({...communeBal, ...communeInfo})
      }
    }

    fetchCommune(communes[0])
  }, [baseLocale, communes])

  return (
    <Card
      border
      elevation={2}
      margin={12}
      padding={6}
      background={baseLocale.status === 'demo' ? '#E4E7EB' : 'tint1'}
    >
      <Pane
        padding={6}
        display='grid'
        gridAutoFlow='row'
        cursor='pointer'
        alignItems='center'
        onClick={handleIsOpen}
      >
        <Pane display='flex' flexFlow='wrap' justifyContent='space-between' alignItems='center' gap='1em 4em'>
          <Pane display='grid' flex={3} gridTemplateColumns='20px 0.8fr 0.4fr' minWidth='400px'>
            {isOpen ? (
              <ChevronDownIcon size={20} />
            ) : (
              <ChevronRightIcon size={20} />
            )}

            <Pane>
              <Heading fontSize='18px'>{nom}</Heading>
              <Pane>
                <Text fontSize={12} fontStyle='italic'>
                  {_updated ? 'Dernière mise à jour il y a ' + majDate : 'Jamais mise à jour'} -
                </Text>

                {communes.length === 0 ? (
                  <Text fontSize={12} fontStyle='italic'>Vide</Text>
                ) : (communes.length < 2 ? (
                  commune && <Text fontStyle='italic'>{commune.nom} ({commune.codeDepartement}) </Text>
                ) : (
                  <Text fontSize={12} fontStyle='italic'>{communes.length} Communes</Text>
                ))}
              </Pane>
            </Pane>

            {communes.length === 1 && commune && (
              <Pane justifySelf='end' alignSelf='center'>
                <CertificationCount nbNumeros={commune.nbNumeros} nbNumerosCertifies={commune.nbNumerosCertifies} />
              </Pane>
            )}
          </Pane>

          <Pane
            display='flex'
            flex={1}
            justifyContent='center'
            height='40px'
            borderRadius={5}
            alignItems='center'
            background={badge.background}
          >
            <Badge color={badge.color} width='250px'>{badge.label}</Badge>
          </Pane>
        </Pane>

      </Pane>

      {isOpen && (
        <>
          <Pane borderTop flex={3} display='flex' flexDirection='row' paddingTop='1em'>
            <Pane flex={1} textAlign='center' margin='auto'>
              <Text>Créée le <Pane><b>{createDate}</b></Pane></Text>
            </Pane>

            {emails && isAdmin && (
              <Pane flex={1} textAlign='center' padding='8px' display='flex' flexDirection='row' justifyContent='center' margin='auto'>
                <Text>{emails.length < 2 ? '1 Administrateur' : emails.length + ' Administrateurs'}</Text>
                <Tooltip
                  content={
                    emails.map(email => (
                      <Pane key={email} fontFamily='Helvetica Neue' padding='.5em'>
                        <UserIcon marginRight='.5em' style={{verticalAlign: 'middle'}} />
                        {email}
                      </Pane>
                    ))
                  }
                  appearance='card'
                >
                  <InfoSignIcon marginY='auto' marginX='.5em' />
                </Tooltip>
              </Pane>
            )}
            {isAdmin && status === 'demo' && (
              <Pane flex={1} display='flex' flexDirection='row' justifyContent='center' marginY='auto' textAlign='center'>
                <Text><small><i>Pas d’administrateur<br /> pour les BAL de démonstration</i></small></Text>
              </Pane>
            )}
          </Pane>

          {isAdmin ? (
            <Pane borderTop display='flex' justifyContent='space-between' paddingTop='1em' marginTop='1em'>
              {hasToken && (
                isDeletable ? (
                  <Button iconAfter={TrashIcon} intent='danger' disabled={!onRemove} onClick={onRemove}>Supprimer</Button>
                ) : (
                  <Tooltip content={tooltipContent}>
                    {/* Button disabled props prevents pointer-events. Button is wrap in <Pane> to allow tooltip content to display => https://evergreen.segment.com/components/buttons#disabled_state */}
                    <Pane>
                      <Button disabled iconAfter={TrashIcon}>Supprimer</Button>
                    </Pane>
                  </Tooltip>
                )
              )}

              {hasToken ? (
                <Button appearance='primary' iconAfter={EditIcon} marginRight='8px' onClick={onSelect}>Gérer les adresses</Button>
              ) : (
                <>
                  <RecoverBALAlert
                    isShown={isBALRecoveryShown}
                    defaultEmail={userEmail}
                    baseLocaleId={baseLocale._id}
                    onClose={() => setIsBALRecoveryShown(false)} />
                  <Button iconAfter={KeyIcon} marginRight='8px' onClick={() => setIsBALRecoveryShown(true)}>Récupérer l’accès</Button>
                </>
              )}
            </Pane>
          ) : (
            <Pane borderTop display='flex' justifyContent='flex-end' paddingTop='1em' marginTop='1em'>
              <Button appearance='primary' marginRight='8px' onClick={onSelect}>Consulter</Button>
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
  isDefaultOpen: false
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
      'draft', 'ready-to-publish', 'published', 'demo'
    ])
  }).isRequired,
  isDefaultOpen: PropTypes.bool,
  isAdmin: PropTypes.bool,
  userEmail: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func

}

export default BaseLocaleCard
