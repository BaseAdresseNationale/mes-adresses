import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Heading} from 'evergreen-ui'

import TokenContext from '../contexts/token'
import BalDataContext from '../contexts/bal-data'

import DialogEdition from './dialog-edition'

const GroupedActions = ({voie, selectedNumerosIds, setSelectedNumerosIds, setToRemove, onSubmit}) => {
  const {token} = useContext(TokenContext)
  const {numeros} = useContext(BalDataContext)

  return (
    <>
      {token && numeros && numeros.length > 1 && selectedNumerosIds.length > 1 && (
        <Pane padding={16}>
          <Pane marginBottom={5}>
            <Heading>Actions groupées</Heading>
          </Pane>
          <Pane>
            <DialogEdition
              {...voie}
              selectedNumerosIds={selectedNumerosIds}
              setSelectedNumerosIds={setSelectedNumerosIds}
              onSubmit={onSubmit}
            />
            <Button
              marginLeft={16}
              iconBefore='trash'
              intent='danger'
              onClick={() => setToRemove(true)}
            >
          Supprimer les numéros
            </Button>
          </Pane>
        </Pane>
      )}
    </>
  )
}

GroupedActions.propTypes = {
  voie: PropTypes.object.isRequired,
  selectedNumerosIds: PropTypes.array.isRequired,
  setSelectedNumerosIds: PropTypes.func.isRequired,
  setToRemove: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default GroupedActions
