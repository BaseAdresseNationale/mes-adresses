import React, {useState, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, EditIcon, Text} from 'evergreen-ui'

import {editVoie} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import VoieEditor from '../../components/bal/voie-editor'

const VoieHeading = ({defaultVoie}) => {
  const [voie, setVoie] = useState(defaultVoie)
  const [hovered, setHovered] = useState(false)
  const {token} = useContext(TokenContext)
  const {editingId, setEditingId, isEditing, reloadVoies, numeros} = useContext(BalDataContext)

  const onEnableVoieEditing = useCallback(() => {
    if (!isEditing) {
      setEditingId(voie._id)
      setHovered(false)
    }
  }, [setEditingId, isEditing, voie._id])

  const onEditVoie = useCallback(async ({nom, typeNumerotation, trace}) => {
    const editedVoie = await editVoie(voie._id, {
      nom,
      typeNumerotation,
      trace
    }, token)

    setEditingId(null)
    await reloadVoies()

    setVoie(editedVoie)
  }, [reloadVoies, setEditingId, token, voie])

  useEffect(() => {
    setVoie(defaultVoie)
  }, [defaultVoie])

  return (
    <Pane
      display='flex'
      flexDirection='column'
      background='tint1'
      padding={16}
    >
      {editingId === voie._id ? (
        <VoieEditor
          initialValue={voie}
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
        <Text>{numeros.length} numéro{numeros.length > 1 ? 's' : ''}</Text>
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
