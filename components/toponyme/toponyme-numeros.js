import React, {useState, useMemo, useCallback} from 'react'
import PropTypes from 'prop-types'
import {groupBy} from 'lodash'
import {Heading, Table, EditIcon, Tooltip, CommentIcon, WarningSignIcon, Position} from 'evergreen-ui'

function ToponymeNumeros({numeros, handleSelect, isEditable}) {
  const [hovered, setHovered] = useState(null)

  const numerosByVoie = useMemo(() => {
    return groupBy(numeros.sort((a, b) => a.numero - b.numero), d => d.voie.nom)
  }, [numeros])

  const handleClick = useCallback(id => {
    if (isEditable) {
      handleSelect(id)
    }
  }, [isEditable, handleSelect])

  return (
    Object.keys(numerosByVoie).sort((a, b) => a > b).map(nomVoie => (
      <React.Fragment key={nomVoie}>
        <Table.Cell style={{padding: 0}} backgroundColor='white'>
          <Heading padding='1em' width='100%'>
            {nomVoie}
          </Heading>
          <Table.TextCell flex='0 1 1'>
            {numerosByVoie[nomVoie].length} numéro{numerosByVoie[nomVoie].length > 1 ? 's' : ''}
          </Table.TextCell>
        </Table.Cell>

        {numerosByVoie[nomVoie].map(({_id, numero, suffixe, positions, comment}) => (
          <Table.Row
            key={_id}
            style={{cursor: 'pointer', backgroundColor: hovered === _id ? '#E4E7EB' : '#f5f6f7'}}
            onMouseEnter={() => setHovered(_id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleClick(_id)}
          >
            <Table.Cell data-browsable>
              <Table.TextCell data-editable flex='0 1 1'>
                {numero}{suffixe} {hovered === _id && isEditable && <EditIcon marginBottom={-4} marginLeft={8} />}
              </Table.TextCell>
            </Table.Cell>

            {positions.length > 1 && (
              <Table.TextCell flex='0 1 1'>
                {`${positions.length} positions`}
              </Table.TextCell>
            )}

            {comment && (
              <Table.Cell flex='0 1 1'>
                <Tooltip
                  content={comment}
                  position={Position.BOTTOM_RIGHT}
                >
                  <CommentIcon color='muted' />
                </Tooltip>
              </Table.Cell>
            )}

            {positions.find(p => p.type === 'inconnue') && (
              <Table.TextCell flex='0 1 1'>
                <Tooltip content='Le type d’une position est inconnu' position={Position.BOTTOM}>
                  <WarningSignIcon color='warning' style={{verticalAlign: 'bottom'}} />
                </Tooltip>
              </Table.TextCell>
            )}
          </Table.Row>
        ))}
      </React.Fragment>
    ))
  )
}

ToponymeNumeros.propTypes = {
  numeros: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}

export default ToponymeNumeros
