import React, {useState, useMemo, useContext} from 'react'
import PropTypes from 'prop-types'
import {groupBy} from 'lodash'
import {Heading, Table, EditIcon} from 'evergreen-ui'

import TokenContext from '../../contexts/token'

function ToponymeNumeros({numeros, handleSelect}) {
  const [hovered, setHovered] = useState(null)
  const {token} = useContext(TokenContext)

  const numerosByVoie = useMemo(() => {
    return groupBy(numeros.sort((a, b) => a.numero - b.numero), d => d.voie[0].nom)
  }, [numeros])

  return (
    Object.keys(numerosByVoie).map(nomVoie => (
      <>
        <Table.Cell style={{padding: 0}}>
          <Heading padding='1em' backgroundColor='white' width='100%'>
            {nomVoie}
          </Heading>
        </Table.Cell>
        {numerosByVoie[nomVoie].map(({_id, numero, suffixe}) => (
          <Table.Row
            key={_id}
            style={{cursor: 'pointer', backgroundColor: hovered === _id ? '#E4E7EB' : '#f5f6f7'}}
            onMouseEnter={() => setHovered(_id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleSelect(_id)}
          >
            <Table.Cell data-browsable>
              <Table.TextCell data-editable flex='0 1 1'>
                {numero}{suffixe} {hovered === _id && token && <EditIcon marginBottom={-4} marginLeft={8} />}
              </Table.TextCell>
            </Table.Cell>
          </Table.Row>
        ))}
      </>
    ))
  )
}

ToponymeNumeros.propTypes = {
  numeros: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}

export default ToponymeNumeros
