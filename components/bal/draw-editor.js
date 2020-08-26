import React, {useContext, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Alert} from 'evergreen-ui'
import {isEqual} from 'lodash'

import DrawContext from '../../contexts/draw'

const DrawEditor = ({lineVoie}) => {
  const {modeId, data, setData} = useContext(DrawContext)

  const handleCancel = useCallback(() => {
    setData(lineVoie)
  }, [setData, lineVoie])

  const isModified = useMemo(() => {
    if (data && lineVoie) {
      return !isEqual(data.geometry.coordinates, lineVoie.geometry.coordinates, isEqual)
    }

    return false
  }, [data, lineVoie])

  return (
    <Pane>
      {isModified && (
        <Button
          type='button'
          marginY={8} marginRight={12}
          iconBefore='edit'
          onClick={handleCancel}
        >
        Annuler les modifications
        </Button>
      )}

      {data && (
        <Button
          type='button'
          intent='danger'
          marginY={8} marginRight={12}
          iconBefore='eraser'
          onClick={() => setData(null)}
        >
        Effacer le tracé
        </Button>
      )}

      <Alert
        intent='none'
        title='Utilisez la carte pour dessiner le tracer de la voie'
        marginBottom={32}
      >
        {modeId === 'drawLineString' ?
          'Cliquez sur la carte pour indiquer le début de la voie, puis ajouter de nouveaux points afin de tracer votre voie. Une fois terminé, cliquez sur le dernier point afin d’indiquer la fin de la voie.' :
          'Modifier le tracé de la voie directement depuis la carte.'
        }
      </Alert>

    </Pane>
  )
}

DrawEditor.defaultProps = {
  lineVoie: null
}

DrawEditor.propTypes = {
  lineVoie: PropTypes.object
}

export default DrawEditor
