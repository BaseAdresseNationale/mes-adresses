import {useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, SelectField} from 'evergreen-ui'

import BalDataContext from '../../contexts/bal-data'

import NumeroEditor from './numero-editor'
import ToponymeEditor from './toponyme-editor'

function AddressEditor({onAddNumero, onAddToponyme, onCancel, isToponyme, setIsToponyme}) {
  const {voie} = useContext(BalDataContext)

  return (
    <Pane>
      <Heading is='h4'>Nouvelle adresse</Heading>

      <SelectField
        label='Créer un nouveau'
        value={isToponyme ? 'toponyme' : 'numero'}
        onChange={event => setIsToponyme(event.target.value === 'toponyme')}
      >
        <option value='numero'>Numéro</option>
        <option value='toponyme'>Toponyme</option>
      </SelectField>

      {isToponyme ? (
        <ToponymeEditor onSubmit={onAddToponyme} onCancel={onCancel} />
      ) : (
        <NumeroEditor initialVoieId={voie?._id} onSubmit={onAddNumero} onCancel={onCancel} />
      )}
    </Pane>
  )
}

AddressEditor.propTypes = {
  onAddNumero: PropTypes.func.isRequired,
  onAddToponyme: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isToponyme: PropTypes.bool.isRequired,
  setIsToponyme: PropTypes.func.isRequired,
}

export default AddressEditor
