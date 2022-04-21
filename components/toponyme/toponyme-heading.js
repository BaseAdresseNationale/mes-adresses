import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, EditIcon, Text} from 'evergreen-ui'

import {editToponyme} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import ToponymeEditor from '@/components/bal/toponyme-editor'

function ToponymeHeading({toponyme}) {
  const [hovered, setHovered] = useState(false)
  const {token} = useContext(TokenContext)
  const {editingId, setEditingId, isEditing, setToponyme, refreshBALSync, reloadToponymes, numeros} = useContext(BalDataContext)

  const onEnableToponymeEditing = () => {
    if (!isEditing) {
      setEditingId(toponyme._id)
      setHovered(false)
    }
  }

  const onEditToponyme = async ({nom, positions, parcelles}) => {
    const editedToponyme = await editToponyme(toponyme._id, {
      nom,
      positions,
      parcelles
    }, token)

    setEditingId(null)

    await reloadToponymes()
    refreshBALSync()

    setToponyme(editedToponyme)
  }

  return (
    <Pane
      display='flex'
      flexDirection='column'
      background='tint1'
      padding={0}
    >
      {editingId === toponyme._id ? (
        <ToponymeEditor
          initialValue={toponyme}
          onSubmit={onEditToponyme}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <Heading
          style={{cursor: hovered && !isEditing ? 'text' : 'default'}}
          onClick={onEnableToponymeEditing}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          padding={16}
        >
          {toponyme.nom}
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
        <Text padding={16}>{numeros.length} numéro{numeros.length > 1 ? 's' : ''}</Text>
      )}
    </Pane>
  )
}

ToponymeHeading.propTypes = {
  toponyme: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    positions: PropTypes.array.isRequired
  }).isRequired
}

export default ToponymeHeading
