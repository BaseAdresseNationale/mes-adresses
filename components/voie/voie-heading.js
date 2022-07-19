import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, EditIcon, Text} from 'evergreen-ui'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import VoieEditor from '@/components/bal/voie-editor'
import LanguagePreview from '../bal/language-preview'

function VoieHeading({voie}) {
  const [hovered, setHovered] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {token} = useContext(TokenContext)
  const {editingId, isEditing, numeros} = useContext(BalDataContext)

  const onEnableVoieEditing = () => {
    if (!isEditing) {
      setIsFormOpen(true)
      setHovered(false)
    }
  }

  return isFormOpen ? (
    <Pane background='tint1' padding={isFormOpen ? 0 : 16}>
      <VoieEditor initialValue={voie} closeForm={() => setIsFormOpen(false)} />
    </Pane>
  ) : (
    <Pane
      display='flex'
      flexDirection='column'
      background='tint1'
      padding={isFormOpen ? 0 : 16}
    >
      <Heading
        style={{cursor: hovered && !isEditing ? 'text' : 'default'}}
        onClick={onEnableVoieEditing}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Pane
          marginBottom={8}
          display='flex'
          flexDirection={voie.nomAlt ? 'row' : 'column'}
          justifyContent='space-between'
        >
          <Pane>
            {voie.nom}
            {!isEditing && token && (
              <EditIcon
                marginBottom={-2}
                marginLeft={8}
                color={hovered ? 'black' : 'muted'}
              />
            )}
          </Pane>
          {numeros && (
            <Text padding={editingId === voie._id ? 16 : 0}>{numeros.length} numéro{numeros.length > 1 ? 's' : ''}</Text>
          )}
        </Pane>
        {voie.nomAlt && <LanguagePreview nomAlt={voie.nomAlt} />}
      </Heading>
    </Pane>
  )
}

VoieHeading.propTypes = {
  voie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    nomAlt: PropTypes.object
  }).isRequired
}

export default VoieHeading
