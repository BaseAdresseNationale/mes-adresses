import React, {useState, useEffect} from 'react'
import {formatDistanceToNow} from 'date-fns'
import {fr} from 'date-fns/locale'
import {Heading, Card, Pane, Text, ChevronRightIcon, ChevronDownIcon, Link} from 'evergreen-ui'

import {getHabilitation} from '@/lib/bal-api'
import {getCommune} from '@/lib/geo-api'

import StatusBadge from '@/components/status-badge'
import BaseLocaleCardContent from '@/components/base-locale-card/base-locale-card-content'
import {BaseLocaleType} from '@/types/base-locale'
import {APIGeoCommuneType} from '@/types/api-geo'
import {HabilitationType} from '@/types/habilitation'

const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'https://adresse.data.gouv.fr'

interface BaseLocaleCardProps {
  baseLocale: BaseLocaleType;
  isAdmin: boolean;
  userEmail: string;
  onRemove: () => void;
  onHide: () => void;
  onSelect: () => void;
  isDefaultOpen: boolean;
  isShownHabilitationStatus: boolean;
}

function BaseLocaleCard({baseLocale, isAdmin, userEmail, isShownHabilitationStatus, isDefaultOpen, onSelect, onRemove, onHide}: BaseLocaleCardProps) {
  const {nom, _updated} = baseLocale
  const [commune, setCommune] = useState<APIGeoCommuneType>()
  const [habilitation, setHabilitation] = useState<HabilitationType | null>(null)
  const [isOpen, setIsOpen] = useState(isAdmin ? isDefaultOpen : false)

  const majDate = formatDistanceToNow(new Date(_updated), {locale: fr})

  const handleIsOpen = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const fetchCommune = async () => {
      const commune: APIGeoCommuneType = await getCommune(baseLocale.commune)

      setCommune(commune)
    }

    const fetchHabilitation = async () => {
      if (!baseLocale.token) {
        return
      }

      try {
        const habilitation: HabilitationType = await getHabilitation(baseLocale.token, baseLocale._id)
        setHabilitation(habilitation)
      } catch {
        setHabilitation(null)
      }
    }

    void fetchCommune()
    void fetchHabilitation()
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
                  <Link onClick={e => e.stopPropagation()} href={`${ADRESSE_URL}/commune/${commune.code}`} fontStyle='italic'> {commune.nom} {commune.codeDepartement ? `(${commune.codeDepartement})` : ''}</Link>
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
            <StatusBadge status={baseLocale.status} sync={baseLocale.sync} />
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

export default BaseLocaleCard
