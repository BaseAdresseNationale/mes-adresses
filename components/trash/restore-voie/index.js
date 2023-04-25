import {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Button, AddIcon, CloseIcon} from 'evergreen-ui'

import ListNumerosDeleted from '@/components/trash/restore-voie/list-numeros-deleted'
import LanguagePreview from '@/components/bal/language-preview'

function RestoreVoie({voie, onRestoreVoie, onClose}) {
  const [selectedNumerosIds, setSelectedNumerosIds] = useState([])

  const restaurerText = () => {
    return 'Restaurer ' + (voie._deleted ?
      ('voie' + (selectedNumerosIds.length > 0 ? ' avec ' + selectedNumerosIds.length + ' numero(s)' : '')) :
      (selectedNumerosIds.length + ' numéro(s)'))
  }

  const handleRestoreVoie = useCallback(async () => {
    await onRestoreVoie(voie, selectedNumerosIds)
    onClose()
  }, [onRestoreVoie, voie, selectedNumerosIds, onClose])

  return (
    <>
      <Pane
        display='flex'
        flexDirection='column'
        background='tint1'
        padding={16}
      >
        <Heading>
          <Pane marginBottom={8}>
            <Pane>
              {voie.nom}
            </Pane>
            {voie.nomAlt && <LanguagePreview nomAlt={voie.nomAlt} />}
          </Pane>
        </Heading>
        <Pane
          display='flex'
          flexDirection='row'
          justifyContent='end'
        >
          <Button
            iconBefore={AddIcon}
            appearance='primary'
            display='inline-flex'
            onClick={() => handleRestoreVoie()}
            disabled={!voie._deleted && selectedNumerosIds.length <= 0}
          >
            {restaurerText()}
          </Button>
          <Button
            iconBefore={CloseIcon}
            appearance='minimal'
            display='inline-flex'
            onClick={() => onClose()}
          >
            Annuler
          </Button>
        </Pane>
      </Pane>
      <ListNumerosDeleted numeros={voie.numeros} selectedNumerosIds={selectedNumerosIds} setSelectedNumerosIds={setSelectedNumerosIds} />
    </>
  )
}

RestoreVoie.propTypes = {
  voie: PropTypes.object.isRequired,
  onRestoreVoie: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default RestoreVoie
