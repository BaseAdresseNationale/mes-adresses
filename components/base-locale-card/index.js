import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Heading, Card, Pane, Text, ChevronRightIcon, ChevronDownIcon} from 'evergreen-ui'
import {formatDistanceToNow} from 'date-fns'
import {fr} from 'date-fns/locale'

import {getCommune} from '../../lib/bal-api'
import {getCommune as getCommuneGeoData} from '../../lib/geo-api'

import CertificationCount from '../certification-count'
import StatusBadge from '../status-badge'

import BaseLocaleCardContent from './base-locale-card-content'

function BaseLocaleCard({baseLocale, isAdmin, userEmail, isDefaultOpen, onSelect, onRemove}) {
  const {nom, communes, _updated} = baseLocale
  const [commune, setCommune] = useState()
  const [isOpen, setIsOpen] = useState(isAdmin ? isDefaultOpen : false)

  const majDate = formatDistanceToNow(new Date(_updated), {locale: fr})

  const handleIsOpen = () => {
    setIsOpen(!isOpen)
  }

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

            <Pane display='grid' justifySelf='end' alignSelf='center' gridTemplateColumns='1fr' gap='1em'>
              {communes.length === 1 && commune && (
                <CertificationCount nbNumeros={commune.nbNumeros} nbNumerosCertifies={commune.nbNumerosCertifies} />
              )}
            </Pane>
          </Pane>

          <Pane
            display='flex'
            flex={1}
            justifyContent='center'
            height='40px'
            borderRadius={5}
            alignItems='center'
          >
            <StatusBadge status={baseLocale.status} sync={baseLocale.sync} />
          </Pane>
        </Pane>

      </Pane>

      {isOpen && (
        <BaseLocaleCardContent
          isAdmin={isAdmin}
          userEmail={userEmail}
          baseLocale={baseLocale}
          onSelect={onSelect}
          onRemove={onRemove}
        />
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
    _updated: PropTypes.string,
    status: PropTypes.oneOf([
      'draft', 'ready-to-publish', 'replaced', 'published', 'demo'
    ]),
    sync: PropTypes.object
  }).isRequired,
  isDefaultOpen: PropTypes.bool,
  isAdmin: PropTypes.bool,
  userEmail: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func
}

export default BaseLocaleCard
