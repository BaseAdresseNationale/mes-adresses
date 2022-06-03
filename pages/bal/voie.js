import React, {useState, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Table} from 'evergreen-ui'

import {getNumeros, getVoie} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import useHelp from '@/hooks/help'

import NumeroEditor from '@/components/bal/numero-editor'
import VoieHeading from '@/components/voie/voie-heading'
import NumerosList from '@/components/voie/numeros-list'

const Voie = React.memo(({hasCadastre}) => {
  const [formState, setFormState] = useState({isOpen: false, editedNumero: null})

  useHelp(3)

  const {token} = useContext(TokenContext)

  const {voie, numeros, isEditing, editingId} = useContext(BalDataContext)

  const handleEditing = useCallback(numeroId => {
    const editedNumero = numeros.find(numero => numero._id === numeroId)
    setFormState({isOpen: true, editedNumero})
  }, [numeros])

  const closeForm = useCallback(() => {
    setFormState({isOpen: false, editedNumero: null})
  }, [])

  // Open form when numero is selected from map
  useEffect(() => {
    if (editingId && numeros.map(({_id}) => _id).includes(editingId)) {
      handleEditing(editingId)
    }
    // HandleEditing has been removed from the list
    // to avoid being retriggered by `numeros` update when form is sumbitted
  }, [editingId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <VoieHeading voie={voie} />

      {formState.isOpen ? (
        <Pane flex={1} overflowY='scroll'>
          <Table.Row height='auto'>
            <Table.Cell display='block' padding={0} background='tint1'>
              <NumeroEditor
                hasPreview
                hasCadastre={hasCadastre}
                initialVoieId={voie._id}
                initialValue={formState.editedNumero}
                closeForm={closeForm}
              />
            </Table.Cell>
          </Table.Row>
        </Pane>
      ) : (
        <NumerosList
          token={token}
          voieId={voie._id}
          numeros={numeros}
          isEditionDisabled={isEditing}
          handleEditing={handleEditing}
        />
      )}
    </>
  )
})

Voie.getInitialProps = async ({query}) => {
  const voie = await getVoie(query.idVoie)
  const numeros = await getNumeros(voie._id)

  return {
    voie,
    numeros
  }
}

Voie.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired,
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired
  }).isRequired,
  hasCadastre: PropTypes.bool.isRequired
}

export default Voie
