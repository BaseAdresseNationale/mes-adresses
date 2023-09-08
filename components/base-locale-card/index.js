import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {formatDistanceToNow} from 'date-fns'
import {fr} from 'date-fns/locale'
import {Heading, Card, Pane, Text, ChevronRightIcon, ChevronDownIcon} from 'evergreen-ui'

import {getBaseLocale, getHabilitation} from '@/lib/bal-api'
import {getCommune} from '@/lib/geo-api'

import StatusBadge from '@/components/status-badge'
import BaseLocaleCardContent from '@/components/base-locale-card/base-locale-card-content'
import {getComputedStatus} from '@/lib/statuses'

function BaseLocaleCard({baseLocale, isAdmin, userEmail, isShownHabilitationStatus, isDefaultOpen, onSelect, onRemove, onHide}) {
  const {nom, _updated} = baseLocale
  const [commune, setCommune] = useState()
  const [habilitation, setHabilitation] = useState(null)
  const [isOpen, setIsOpen] = useState(isAdmin ? isDefaultOpen : false)

  const majDate = formatDistanceToNow(new Date(_updated), {locale: fr})

  const handleIsOpen = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const fetchCommune = async () => {
      const communeBal = await getBaseLocale(baseLocale._id)
      const communeGeo = await getCommune(baseLocale.commune)

      setCommune({...communeBal, ...communeGeo})
    }

    const fetchHabilitation = async () => {
      if (!baseLocale.token) {
        return
      }

      try {
        const habilitation = await getHabilitation(baseLocale.token, baseLocale._id)
        setHabilitation(habilitation)
      } catch {
        setHabilitation(null)
      }
    }

    fetchCommune()
    fetchHabilitation()
  }, [baseLocale])

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

                {commune && (
                  <Text fontStyle='italic'> {commune.nom} {commune.codeDepartement ? `(${commune.codeDepartement})` : ''}</Text>
                )}
              </Pane>
            </Pane>
          </Pane>

          <Pane
            display='flex'
            flex={1}
            justifyContent='center'
            height='40px'
            minWidth='200px'
            borderRadius={5}
            alignItems='center'
          >
            <StatusBadge {...getComputedStatus(baseLocale.status, baseLocale.sync)} />
          </Pane>
        </Pane>

      </Pane>

      {isOpen && (
        <BaseLocaleCardContent
          isAdmin={isAdmin}
          userEmail={userEmail}
          baseLocale={baseLocale}
          commune={commune}
          habilitation={habilitation}
          isShownHabilitationStatus={isShownHabilitationStatus}
          onSelect={onSelect}
          onRemove={onRemove}
          onHide={onHide}
        />
      )}
    </Card>
  )
}

BaseLocaleCard.defaultProps = {
  isAdmin: false,
  userEmail: null,
  onRemove: null,
  onHide: null,
  onSelect: null,
  isDefaultOpen: false,
  isShownHabilitationStatus: false
}

BaseLocaleCard.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    token: PropTypes.string,
    nom: PropTypes.string.isRequired,
    commune: PropTypes.string.isRequired,
    _updated: PropTypes.string,
    status: PropTypes.oneOf([
      'draft', 'ready-to-publish', 'replaced', 'published', 'demo'
    ]),
    sync: PropTypes.object
  }).isRequired,
  isDefaultOpen: PropTypes.bool,
  isAdmin: PropTypes.bool,
  userEmail: PropTypes.string,
  onSelect: PropTypes.func,
  onHide: PropTypes.func,
  onRemove: PropTypes.func,
  isShownHabilitationStatus: PropTypes.bool
}

export default BaseLocaleCard
