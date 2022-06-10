import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, SelectField} from 'evergreen-ui'

import BalDataContext from '@/contexts/bal-data'

import NumeroEditor from '@/components/bal/numero-editor'
import ToponymeEditor from '@/components/bal/toponyme-editor'

function AddressEditor({commune, closeForm}) {
  const [isToponyme, setIsToponyme] = useState(false)

  const {voie} = useContext(BalDataContext)

  return (
    <Pane display='flex' flexDirection='column' height='100%'>
      <Pane padding={12}>
        <Heading is='h4'>Nouvelle adresse</Heading>
        <SelectField
          label='Créer un nouveau'
          value={isToponyme ? 'toponyme' : 'numero'}
          onChange={e => setIsToponyme(e.target.value === 'toponyme')}
        >
          <option value='numero'>Numéro</option>
          <option value='toponyme'>Toponyme</option>
        </SelectField>
      </Pane>

      <Pane display='flex' flexDirection='column' flex={1} overflowY='auto'>
        {isToponyme ? (
          <ToponymeEditor commune={commune} closeForm={closeForm} />
        ) : (
          <NumeroEditor initialVoieId={voie?._id} commune={commune} hasPreview closeForm={closeForm} />
        )}
      </Pane>
    </Pane>
  )
}

AddressEditor.propTypes = {
  commune: PropTypes.shape({
    hasCadastre: PropTypes.bool.isRequired
  }).isRequired,
  closeForm: PropTypes.func.isRequired
}

export default AddressEditor
