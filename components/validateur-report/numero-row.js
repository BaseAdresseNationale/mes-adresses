import {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, Text, UnorderedList, ListItem} from 'evergreen-ui'
import {filter, some, size} from 'lodash'

import {getLabel} from '@ban-team/validateur-bal'

import AlertHeader from '@/components/validateur-report/alerts-header'
import Dropdown from '@/components/dropdown'

function NumeroRow({numero, numerosWithAlerts}) {
  const {address, alerts} = numero
  const [isNumeroOpen, setIsNumeroOpen] = useState(false)

  return (
    <Dropdown
      key={address.numero}
      isOpen={isNumeroOpen}
      handleOpen={() => setIsNumeroOpen(!isNumeroOpen)}
      dropdownStyle='secondary'
    >
      <Pane width='100%' display='flex' flexDirection='column' gap={20} justifyContent='center'>
        <AlertHeader
          type='secondary'
          hasWarnings={some(numerosWithAlerts, numero => size(filter(numero.alerts, {level: 'W'})) > 0)}
          hasErrors={some(numerosWithAlerts, numero => size(filter(numero.alerts, {level: 'E'})) > 0)}
          hasInfos={some(numerosWithAlerts, numero => size(filter(numero.alerts, {level: 'I'})) > 0)}
        >
          <Text fontSize={15} fontWeight={700}>{address.numero} {address.voie_nom}</Text>
        </AlertHeader>

        {isNumeroOpen && (
          <UnorderedList background='white' borderRadius={6} padding={8}>
            {alerts.map(({code, level}) => (
              <ListItem
                key={code}
                color={level === 'E' ? 'red500' : 'orange500'}
                padding={0}
                marginX={14}
              >
                {getLabel(code)}
              </ListItem>
            )
            )}
          </UnorderedList>
        )}
      </Pane>
    </Dropdown>
  )
}

NumeroRow.propTypes = {
  numero: PropTypes.object.isRequired,
  numerosWithAlerts: PropTypes.array.isRequired
}

export default NumeroRow
