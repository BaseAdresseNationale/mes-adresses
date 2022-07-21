import {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, EditIcon, Text} from 'evergreen-ui'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import ToponymeEditor from '@/components/bal/toponyme-editor'
import LanguagePreview from '../bal/language-preview'

function ToponymeHeading({toponyme, commune}) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  const {token} = useContext(TokenContext)
  const {isEditing, editingId, numeros} = useContext(BalDataContext)

  const onEnableToponymeEditing = () => {
    if (!isEditing) {
      setIsFormOpen(true)
      setHovered(false)
    }
  }

  useEffect(() => {
    if (editingId === toponyme._id) {
      setIsFormOpen(true)
    }
  }, [editingId, toponyme._id])

  return isFormOpen ? (
    <Pane background='tint1' padding={0}>
      <Pane maxHeight={700} overflowY='scroll'>
        <ToponymeEditor initialValue={toponyme} commune={commune} closeForm={() => setIsFormOpen(false)} />
      </Pane>
    </Pane>
  ) : (
    <Pane
      display='flex'
      flexDirection='column'
      background='tint1'
      padding={16}
    >
      <Heading
        style={{cursor: hovered && !isEditing ? 'text' : 'default'}}
        onClick={onEnableToponymeEditing}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        padding={0}
      >
        <Pane
          marginBottom={8}
          display='flex'
          flexDirection={toponyme.nomAlt ? 'row' : 'column'}
          justifyContent='space-between'
        >
          <Pane>
            {toponyme.nom}
            {!isEditing && token && (
              <EditIcon
                marginBottom={-2}
                marginLeft={8}
                color={hovered ? 'black' : 'muted'}
              />
            )}
          </Pane>
          {numeros && (
            <Text padding={editingId === toponyme._id ? 16 : 0}>{numeros.length} numéro{numeros.length > 1 ? 's' : ''}</Text>
          )}
        </Pane>
        {toponyme.nomAlt && <LanguagePreview nomAlt={toponyme.nomAlt} />}
      </Heading>
    </Pane>
  )
}

ToponymeHeading.propTypes = {
  toponyme: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    positions: PropTypes.array.isRequired,
    nomAlt: PropTypes.object
  }).isRequired,
  commune: PropTypes.object.isRequired
}

export default ToponymeHeading
