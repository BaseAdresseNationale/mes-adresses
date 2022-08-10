import {useState} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {Pane, Heading, Text, UnorderedList, ListItem} from 'evergreen-ui'
import {sortBy} from 'lodash'

import {getLabel} from '@ban-team/validateur-bal'

import NumeroRow from '@/components/validateur-report/numero-row'
import AlertHeader from '@/components/validateur-report/alerts-header'
import Dropdown from '@/components/dropdown'

function VoieRow({nomVoie, voie, baseLocaleId}) {
  const [isVoieOpen, setIsVoieOpen] = useState(false)

  const {voieId, voieAlerts, numerosWithAlerts} = voie

  return (
    <Dropdown isOpen={isVoieOpen} handleOpen={() => setIsVoieOpen(!isVoieOpen)}>
      <Pane width='100%'>
        <Pane display='flex' flexDirection='column' gap={8}>
          <AlertHeader isVoie voieAlerts={voieAlerts}>
            <Pane width='100%' display='flex' justifyContent='space-between' alignItems='center'>
              <Heading as='h2' fontSize={16}>{nomVoie}</Heading>
              {voieId && (
                <Link href={`/bal/voie?balId=${baseLocaleId}&idVoie=${voieId}`} passHref>
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
              <AlertHeader numerosWithAlerts={numerosWithAlerts}>
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
                  {voieAlerts.map(alert => {
                    return (
                      <ListItem
                        key={alert.code}
                        color={alert.level === 'E' ? 'red500' : 'orange500'}
                        fontSize={15}
                      >
                        {getLabel(alert.code)}
                      </ListItem>
                    )
                  })}
                </UnorderedList>
              </Pane>
            )}

            {numerosWithAlerts.length > 0 && (
              <>
                <Text width='100%' fontWeight={700} fontSize={16}>Alertes concernant les numéros de la voie</Text>
                <Pane display='flex' flexDirection='column' gap={10} marginTop={6}>
                  {sortBy(numerosWithAlerts, item => item.address.numero, ['asc']).map(numero =>
                    <NumeroRow key={numero.address.numero} numero={numero} numerosWithAlerts={numerosWithAlerts} />)}
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
  voie: PropTypes.object.isRequired,
  baseLocaleId: PropTypes.string.isRequired
}

export default VoieRow
