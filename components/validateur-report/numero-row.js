import {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Text, UnorderedList, ListItem} from 'evergreen-ui'
import {filter} from 'lodash'
import {getLabel} from '@ban-team/validateur-bal'

import AlertHeader from '@/components/validateur-report/alerts-header'
import Dropdown from '@/components/dropdown'

function NumeroRow({address, alerts}) {
  const [isNumeroOpen, setIsNumeroOpen] = useState(false)

  const [hasWarnings, hasErrors, hasInfos] = useMemo(() => {
    return [
      filter(alerts, ({level}) => level === 'W').length > 0,
      filter(alerts, ({level}) => level === 'E').length > 0,
      filter(alerts, ({level}) => level === 'I').length > 0
    ]
  }, [alerts])

  return (
    <Dropdown
      key={`${address.long}-${address.lat}`}
      isOpen={isNumeroOpen}
      handleOpen={() => setIsNumeroOpen(!isNumeroOpen)}
      dropdownStyle='secondary'
    >
      <Pane width='100%' display='flex' flexDirection='column' gap={20} justifyContent='center'>
        <AlertHeader
          type='secondary'
          hasWarnings={hasWarnings}
          hasErrors={hasErrors}
          hasInfos={hasInfos}
        >
          <Text fontSize={15} fontWeight={700}>{address.numero} {address.voie_nom}</Text>
        </AlertHeader>

        {isNumeroOpen && (
          <UnorderedList background='white' borderRadius={6} padding={8}>
            {alerts.map(({code, level}) => (
              <ListItem
                key={code}
                color={level === 'E' ? 'red500' : (level === 'W' ? 'orange500' : 'blue500')}
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
  address: PropTypes.object.isRequired,
  alerts: PropTypes.array.isRequired
}

export default NumeroRow
