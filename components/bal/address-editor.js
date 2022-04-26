import {useState, useEffect, useContext, useRef} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Pane, Heading, SelectField} from 'evergreen-ui'

import {addNumero, addToponyme, addVoie} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import NumeroEditor from '@/components/bal/numero-editor'
import ToponymeEditor from '@/components/bal/toponyme-editor'

function AddressEditor({closeForm}) {
  const {token} = useContext(TokenContext)
  const {baseLocale, commune, voie, isEditing, setIsEditing, reloadVoies, reloadNumeros, reloadToponymes, reloadGeojson, refreshBALSync} = useContext(BalDataContext)

  const [isToponyme, setIsToponyme] = useState(false)

  const formRef = useRef(false)
  const router = useRouter()

  const onAddToponyme = async toponymeData => {
    await addToponyme(baseLocale._id, commune.code, toponymeData, token)
    await reloadToponymes()
    await reloadGeojson()
    refreshBALSync()

    closeForm()
  }

  const onAddNumero = async (voieData, numero) => {
    let editedVoie = voieData
    const isNewVoie = !editedVoie._id

    if (isNewVoie) {
      editedVoie = await addVoie(baseLocale._id, commune.code, editedVoie, token)
    }

    await addNumero(editedVoie._id, numero, token)

    if (voie?._id === editedVoie._id) {
      await reloadNumeros()
    }

    await reloadVoies()
    refreshBALSync()

    if (!voie || voie._id !== editedVoie._id || isNewVoie) {
      await reloadGeojson()
    }

    closeForm()
  }

  // Close form when edition is canceled
  useEffect(() => {
    if (formRef.current && !isEditing) {
      closeForm()
    }
  }, [isEditing, closeForm])

  // Close form on page changes
  useEffect(() => {
    if (formRef.current) {
      closeForm()
    }
  }, [router, closeForm])

  useEffect(() => {
    setIsEditing(true)
    formRef.current = true
    return () => {
      setIsEditing(false)
    }
  }, [setIsEditing])

  return (
    <Pane overflowY='scroll'>
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
  closeForm: PropTypes.func.isRequired
}

export default AddressEditor
