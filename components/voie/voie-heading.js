import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, EditIcon, Text} from 'evergreen-ui'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import VoieEditor from '@/components/bal/voie-editor'

function VoieHeading({voie}) {
  const [hovered, setHovered] = useState(false)

  const {token} = useContext(TokenContext)
  const {editingId, setEditingId, isEditing, numeros} = useContext(BalDataContext)

  const onEnableVoieEditing = () => {
    if (!isEditing) {
      setEditingId(voie._id)
      setHovered(false)
    }
  }

  return (
    <Pane
      display='flex'
      flexDirection='column'
      background='tint1'
      padding={editingId === voie._id ? 0 : 16}
    >
      {editingId === voie._id ? (
        <VoieEditor initialValue={voie} closeForm={() => setEditingId(null)} />
      ) : (
        <Heading
          style={{cursor: hovered && !isEditing ? 'text' : 'default'}}
          onClick={onEnableVoieEditing}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {voie.nom}
          {!isEditing && token && (
            <EditIcon
              marginBottom={-2}
              marginLeft={8}
              color={hovered ? 'black' : 'muted'}
            />
          )}
        </Heading>
      )}
      {numeros && (
        <Text padding={editingId === voie._id ? 16 : 0}>{numeros.length} numéro{numeros.length > 1 ? 's' : ''}</Text>
      )}
    </Pane>
  )
}

VoieHeading.propTypes = {
  voie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired
}

export default VoieHeading
