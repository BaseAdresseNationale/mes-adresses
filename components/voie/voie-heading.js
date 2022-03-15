import {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, EditIcon, Text} from 'evergreen-ui'

import {editVoie} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import VoieEditor from '@/components/bal/voie-editor'

function VoieHeading({defaultVoie}) {
  const [editedVoie, setEditedVoie] = useState(defaultVoie)
  const [hovered, setHovered] = useState(false)

  const {token} = useContext(TokenContext)
  const {editingId, setEditingId, isEditing, refreshBALSync, reloadVoies, reloadGeojson, numeros, setVoie} = useContext(BalDataContext)

  const onEnableVoieEditing = () => {
    if (!isEditing) {
      setEditingId(editedVoie._id)
      setHovered(false)
    }
  }

  const onEditVoie = async ({nom, typeNumerotation, trace}) => {
    const voie = await editVoie(editedVoie._id, {
      nom,
      typeNumerotation,
      trace
    }, token)

    setEditingId(null)

    await reloadVoies()
    await reloadGeojson()
    refreshBALSync()

    setEditedVoie(voie)

    // Update voie name in breadcrum
    if (editingId === editedVoie._id) {
      setVoie(voie)
    }
  }

  useEffect(() => {
    setEditedVoie(defaultVoie)
  }, [defaultVoie])

  return (
    <Pane
      display='flex'
      flexDirection='column'
      background='tint1'
      padding={editingId === editedVoie._id ? 0 : 16}
    >
      {editingId === editedVoie._id ? (
        <VoieEditor
          initialValue={editedVoie}
          onSubmit={onEditVoie}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <Heading
          style={{cursor: hovered && !isEditing ? 'text' : 'default'}}
          onClick={onEnableVoieEditing}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {editedVoie.nom}
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
        <Text padding={editingId === editedVoie._id ? 16 : 0}>{numeros.length} numéro{numeros.length > 1 ? 's' : ''}</Text>
      )}
    </Pane>
  )
}

VoieHeading.propTypes = {
  defaultVoie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired
}

export default VoieHeading
