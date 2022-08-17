import {useState, useMemo, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {format} from 'date-fns'
import {fr} from 'date-fns/locale'
import {Pane, Button, Tooltip, Text, Heading, UserIcon, InfoSignIcon, TrashIcon, EditIcon, KeyIcon, EyeOffIcon} from 'evergreen-ui'

import {getBaseLocaleCsvUrl} from '@/lib/bal-api'
import {prevalidate} from '@ban-team/validateur-bal'

import LocalStorageContext from '@/contexts/local-storage'

import RecoverBALAlert from '@/components/bal-recovery/recover-bal-alert'
import ValidateurReport from '../validateur-report'

function BaseLocaleCardContent({isAdmin, baseLocale, voies, userEmail, onSelect, onRemove, onHide}) {
  const {status, _created, emails} = baseLocale

  const [isBALRecoveryShown, setIsBALRecoveryShown] = useState(false)
  const [csvUrl, setCsvUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState(null)

  const {getBalToken} = useContext(LocalStorageContext)

  const hasToken = useMemo(() => {
    return Boolean(getBalToken(baseLocale._id))
  }, [baseLocale._id, getBalToken])

  const createDate = format(new Date(_created), 'PPP', {locale: fr})
  const isDeletable = status === 'draft' || status === 'demo'
  const tooltipContent = status === 'ready-to-publish' ?
    'Vous ne pouvez pas supprimer une BAL lorsqu’elle est prête à être publiée' :
    'Vous ne pouvez pas supprimer une Base Adresse Locale qui est publiée. Si vous souhaitez la dé-publier, veuillez contacter le support adresse@data.gouv.fr'

  useEffect(() => {
    const fetchCsvUrl = async () => {
      const url = await getBaseLocaleCsvUrl(baseLocale._id)
      setCsvUrl(url)
    }

    fetchCsvUrl()
  }, [baseLocale])

  const parseFile = async file => {
    setIsLoading(true)
    try {
      const report = await prevalidate(file, {relaxFieldsDetection: true})
      if (report.parseOk) {
        setReport(report.rows)
      } else {
        console.log(`Impossible d’analyser le fichier... [${report.parseErrors[0].message}]`)
        setReport(null)
      }
    } catch {
      setReport(null)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (csvUrl) {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', csvUrl)
      xhr.responseType = 'blob'
      xhr.addEventListener('load', () => {
        parseFile(xhr.response)
      })

      xhr.send()
    }
  }, [csvUrl])

  return (
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
          <Pane display='flex' flexFlow='wrap' gap={8}>
            {hasToken && (
              isDeletable ? (
                <Button iconAfter={TrashIcon} intent='danger' disabled={!onRemove} onClick={onRemove}>Supprimer définitivement</Button>
              ) : (
                <Tooltip content={tooltipContent}>
                  {/* Button disabled props prevents pointer-events. Button is wrap in <Pane> to allow tooltip content to display => https://evergreen.segment.com/components/buttons#disabled_state */}
                  <Pane>
                    <Button disabled iconAfter={TrashIcon}>Supprimer définitivement</Button>
                  </Pane>
                </Tooltip>
              )
            )}

            {onHide && <Button iconAfter={EyeOffIcon} onClick={onHide}>Masquer de la liste</Button>}
          </Pane>

          {hasToken ? (
            <Button
              appearance='primary'
              iconAfter={EditIcon}
              marginRight='8px'
              onClick={onSelect}
              disabled={!onSelect}
            >
              Gérer les adresses
            </Button>
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

      {!isLoading && report && (
        <Pane marginTop='1em'>
          <Heading is='h3' fontSize={17} marginBottom={6}>Anomalies détectées</Heading>
          <ValidateurReport
            rows={report}
            voies={voies}
            baseLocaleId={baseLocale._id}
          />
        </Pane>
      )}
    </>
  )
}

BaseLocaleCardContent.defaultProps = {
  isAdmin: false,
  userEmail: null,
  onRemove: null,
  onHide: null,
  onSelect: null
}

BaseLocaleCardContent.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    emails: PropTypes.array,
    _created: PropTypes.string.isRequired,
    status: PropTypes.oneOf([
      'draft', 'ready-to-publish', 'replaced', 'published', 'demo'
    ])
  }).isRequired,
  voies: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool,
  userEmail: PropTypes.string,
  onSelect: PropTypes.func,
  onHide: PropTypes.func,
  onRemove: PropTypes.func
}

export default BaseLocaleCardContent
