import React, {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, EditIcon, Text} from 'evergreen-ui'

import {editVoie} from '../../lib/bal-api'
import {getFullVoieName} from '../../lib/voie'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import VoieEditor from '../../components/bal/voie-editor'

const VoieHeading = ({voie}) => {
  const [hovered, setHovered] = useState(false)
  const [editedVoie, setEditedVoie] = useState(voie)
  const currentVoie = editedVoie || voie
  const {token} = useContext(TokenContext)
  const {baseLocale, editingId, setEditingId, reloadVoies, numeros} = useContext(BalDataContext)

  const onEnableVoieEditing = useCallback(() => {
    setEditingId(voie._id)
    setHovered(false)
  }, [setEditingId, voie._id])

  const onEditVoie = useCallback(async ({nom, typeNumerotation, trace, complement, positions}) => {
    const editedVoie = await editVoie(voie._id, {
      nom,
      typeNumerotation,
      trace,
      complement,
      positions
    }, token)

    setEditingId(null)
    await reloadVoies()

    setEditedVoie(editedVoie)
  }, [reloadVoies, setEditingId, token, voie])

  return (
    <Pane
      display='flex'
      flexDirection='column'
      background='tint1'
      padding={16}
    >
      {editingId === voie._id ? (
        <VoieEditor
          hasNumeros={numeros.length > 0}
          initialValue={{...currentVoie}}
          isEnabledComplement={Boolean(baseLocale.enableComplement)}
          onSubmit={onEditVoie}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <Heading
          style={{cursor: hovered ? 'text' : 'default'}}
          onClick={onEnableVoieEditing}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {getFullVoieName(currentVoie, baseLocale.enableComplement)}
          <EditIcon
            marginBottom={-2}
            marginLeft={8}
            color={hovered ? 'black' : 'muted'}
          />
        </Heading>
      )}
      {numeros && (
        <Text>{numeros.length} numéro{numeros.length > 1 ? 's' : ''}</Text>
      )}
    </Pane>
  )
}

VoieHeading.propTypes = {
  voie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    complement: PropTypes.string,
    positions: PropTypes.array.isRequired
  }).isRequired
}

export default VoieHeading
