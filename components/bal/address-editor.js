import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, SelectField} from 'evergreen-ui'

import {addNumero, addToponyme, addVoie} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import NumeroEditor from './numero-editor'
import ToponymeEditor from './toponyme-editor'

function AddressEditor({commune, balId, codeCommune, closeForm}) {
  const {token} = useContext(TokenContext)
  const {voie, reloadVoies, reloadNumeros, reloadToponymes, reloadGeojson} = useContext(BalDataContext)

  const [isToponyme, setIsToponyme] = useState(false)

  const onAddToponyme = async toponymeData => {
    await addToponyme(balId, codeCommune, toponymeData, token)
    await reloadToponymes()
    await reloadGeojson()

    closeForm()
  }

  const onAddNumero = async (voieData, numero) => {
    let editedVoie = voieData
    const isNewVoie = !editedVoie._id

    if (isNewVoie) {
      editedVoie = await addVoie(balId, codeCommune, editedVoie, token)
    }

    await addNumero(editedVoie._id, numero, token)
    await reloadNumeros()
    await reloadVoies()

    if (!voie || voie._id !== editedVoie._id || isNewVoie) {
      await reloadGeojson()
    }

    closeForm()
  }

  return (
    <Pane>
      <Pane padding={12}>
        <Heading is='h4' >Nouvelle adresse</Heading>
        <SelectField
          label='Créer un nouveau'
          value={isToponyme ? 'toponyme' : 'numero'}
          onChange={e => setIsToponyme(e.target.value === 'toponyme')}
        >
          <option value='numero'>Numéro</option>
          <option value='toponyme'>Toponyme</option>
        </SelectField>
      </Pane>

      {isToponyme ? (
        <ToponymeEditor onSubmit={onAddToponyme} onCancel={closeForm} />
      ) : (
        <NumeroEditor commune={commune} initialVoieId={voie?._id} onSubmit={onAddNumero} onCancel={closeForm} />
      )}
    </Pane>
  )
}

AddressEditor.propTypes = {
  commune: PropTypes.object.isRequired,
  balId: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired
}

export default AddressEditor
