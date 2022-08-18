import {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {Pane, Heading, Text, UnorderedList, ListItem} from 'evergreen-ui'
import {sortBy, some} from 'lodash'
import {getLabel} from '@ban-team/validateur-bal'

import NumeroRow from '@/components/validateur-report/numero-row'
import AlertHeader from '@/components/validateur-report/alerts-header'
import Dropdown from '@/components/dropdown'

function VoieRow({nomVoie, voie, onRedirect}) {
  const [isVoieOpen, setIsVoieOpen] = useState(false)

  const {voieId, voieAlerts, numerosWithAlerts} = voie

  const hasVoieAlerts = useMemo(() => {
    return {
      hasWarnings: some(voieAlerts, ({level}) => level === 'W'),
      hasErrors: some(voieAlerts, ({level}) => level === 'E'),
      hasInfos: some(voieAlerts, ({level}) => level === 'I')
    }
  }, [voieAlerts])

  const hasNumeroAlerts = useMemo(() => {
    return {
      hasWarnings: some(numerosWithAlerts, ({alerts}) => alerts.filter(({level}) => level === 'W').length > 0),
      hasErrors: some(numerosWithAlerts, ({alerts}) => alerts.filter(({level}) => level === 'E').length > 0),
      hasInfos: some(numerosWithAlerts, ({alerts}) => alerts.filter(({level}) => level === 'I').length > 0)
    }
  }, [numerosWithAlerts])

  return (
    <Dropdown isOpen={isVoieOpen} handleOpen={() => setIsVoieOpen(!isVoieOpen)}>
      <Pane width='100%'>
        <Pane display='flex' flexDirection='column' gap={8}>
          <AlertHeader size={22} {...hasVoieAlerts}>
            <Pane width='100%' display='flex' justifyContent='space-between' alignItems='center'>
              <Heading is='h4' size='400'>{nomVoie}</Heading>
              {voieId && (
                <Link href={onRedirect(voieId)} passHref>
                  <Text
                    marginRight={8}
                    fontStyle='italic'
                    color='neutral'
                    textDecoration='underline'
                    cursor='pointer'
                  >
                    Accéder à la voie
                  </Text>
                </Link>
              )}
            </Pane>
          </AlertHeader>

          {numerosWithAlerts.length > 0 && (
            <Pane paddingLeft={20}>
              <AlertHeader {...hasNumeroAlerts}>
                <Text fontStyle='italic'>
                  {`${numerosWithAlerts.length} ${numerosWithAlerts.length > 1 ? 'numéros ont' : 'numéro a'} des alertes`}
                </Text>
              </AlertHeader>
            </Pane>
          )}
        </Pane>

        {isVoieOpen && (
          <Pane paddingLeft={20} margin={16}>
            {voieAlerts.length > 0 && (
              <Pane marginY={20}>
                <Text fontWeight={700} fontSize={16}>Alertes concernant la voie</Text>
                <UnorderedList >
                  {voieAlerts.map(({code, level}) => (
                    <ListItem
                      key={code}
                      color={level === 'E' ? 'red500' : 'orange500'}
                      fontSize={15}
                    >
                      {getLabel(code)}
                    </ListItem>
                  )
                  )}
                </UnorderedList>
              </Pane>
            )}

            {numerosWithAlerts.length > 0 && (
              <>
                <Text width='100%' fontWeight={700} fontSize={16}>Alertes concernant les numéros de la voie</Text>
                <Pane display='flex' flexDirection='column' gap={10} marginTop={6}>
                  {sortBy(numerosWithAlerts, item => item.address.numero, ['asc']).map(numero =>
                    <NumeroRow key={numero.address.numero} {...numero} />)}
                </Pane>
              </>
            )}
          </Pane>
        )}
      </Pane>
    </Dropdown>
  )
}

VoieRow.propTypes = {
  nomVoie: PropTypes.string.isRequired,
  voie: PropTypes.shape({
    voieId: PropTypes.string.isRequired,
    voieAlerts: PropTypes.array.isRequired,
    numerosWithAlerts: PropTypes.array.isRequired
  }).isRequired,
  onRedirect: PropTypes.func.isRequired
}

export default VoieRow
