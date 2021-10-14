import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Pane, Heading, SelectField} from 'evergreen-ui'

import {addNumero, addToponyme, addVoie} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import NumeroEditor from './numero-editor'
import ToponymeEditor from './toponyme-editor'

function AddressEditor({balId, codeCommune, closeForm}) {
  const router = useRouter()

  const {token} = useContext(TokenContext)
  const {voie, reloadVoies, reloadNumeros} = useContext(BalDataContext)

  const [isToponyme, setIsToponyme] = useState(false)

  const reloadView = (idVoie, isVoiesList, isNumeroCreated) => {
    if (voie && voie._id === idVoie) { // Numéro créé sur la voie en cours
      reloadNumeros()
    } else if (isNumeroCreated) { // Numéro créé depuis la vue commune ou une autre voie
      router.push(
        `/bal/voie?balId=${balId}&codeCommune=${codeCommune}&idVoie=${idVoie}`,
        `/bal/${balId}/communes/${codeCommune}/voies/${idVoie}`
      )
    } else if (isVoiesList) { // Toponyme créé depuis la vue commune
      reloadVoies()
    } else { // Toponyme créé depuis la vue voie
      router.push(
        `/bal/commune?balId=${balId}&codeCommune=${codeCommune}`,
        `/bal/${balId}/communes/${codeCommune}`
      )
    }
  }

  const onAddToponyme = async toponymeData => {
    const editedToponyme = await addToponyme(balId, codeCommune, toponymeData, token)

    closeForm()
    router.push(
      `/bal/toponyme?balId=${balId}&codeCommune=${codeCommune}&idToponyme=${editedToponyme._id}`,
      `/bal/${balId}/communes/${codeCommune}/toponymes/${editedToponyme._id}`
    )
  }

  const onAddNumero = async (voieData, numero) => {
    let editedVoie = voieData

    if (!editedVoie._id) {
      editedVoie = await addVoie(balId, codeCommune, editedVoie, token)
    }

    if (numero) {
      await addNumero(editedVoie._id, numero, token)
    }

    closeForm()
    reloadView(editedVoie._id, Boolean(!voie), Boolean(numero))
  }

  return (
    <Pane>
      <Heading is='h4'>Nouvelle adresse</Heading>
      <SelectField
        label='Créer un nouveau'
        value={isToponyme ? 'toponyme' : 'numero'}
        onChange={e => setIsToponyme(e.target.value === 'toponyme')}
      >
        <option value='numero'>Numéro</option>
        <option value='toponyme'>Toponyme</option>
      </SelectField>

      {isToponyme ? (
        <ToponymeEditor onSubmit={onAddToponyme} onCancel={closeForm} />
      ) : (
        <NumeroEditor initialVoieId={voie?._id} onSubmit={onAddNumero} onCancel={closeForm} />
      )}
    </Pane>
  )
}

AddressEditor.propTypes = {
  balId: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired
}

export default AddressEditor
