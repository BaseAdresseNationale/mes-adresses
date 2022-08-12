import React, {useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Table} from 'evergreen-ui'

import {getNumeros, getVoie} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import useHelp from '@/hooks/help'
import useFormState from '@/hooks/form-state'

import NumeroEditor from '@/components/bal/numero-editor'
import VoieHeading from '@/components/voie/voie-heading'
import NumerosList from '@/components/voie/numeros-list'

const Voie = React.memo(({commune}) => {
  const [isFormOpen, handleEditing, editedNumero, reset] = useFormState()

  useHelp(3)

  const {token} = useContext(TokenContext)
  const {voie, numeros, reloadNumeros} = useContext(BalDataContext)

  // Load protected fields (ex: 'comment')
  useEffect(() => {
    if (token) {
      reloadNumeros()
    }
  }, [token, reloadNumeros])

  return (
    <>
      <VoieHeading voie={voie} />

      {isFormOpen ? (
        <Pane flex={1} overflowY='scroll'>
          <Table.Row height='auto'>
            <Table.Cell display='block' padding={0} background='tint1'>
              <NumeroEditor
                hasPreview
                initialVoieId={voie._id}
                initialValue={editedNumero}
                commune={commune}
                closeForm={reset}
              />
            </Table.Cell>
          </Table.Row>
        </Pane>
      ) : (
        <NumerosList
          token={token}
          voieId={voie._id}
          numeros={numeros}
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
  commune: PropTypes.object.isRequired
}

export default Voie
