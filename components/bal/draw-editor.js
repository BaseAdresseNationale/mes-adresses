import {useContext, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import {isEqual} from 'lodash'
import {Pane, Heading, Button, Alert, EditIcon, EraserIcon} from 'evergreen-ui'

import DrawContext from '@/contexts/draw'

function DrawEditor({trace}) {
  const {modeId, data, setData} = useContext(DrawContext)

  const handleCancel = useCallback(() => {
    setData({
      type: 'Feature',
      properties: {},
      geometry: trace
    })
  }, [setData, trace])

  const handleDelete = useCallback(() => {
    setData(null)
  }, [setData])

  const isModified = useMemo(() => {
    if (data && trace) {
      return !isEqual(data.geometry.coordinates, trace.coordinates, isEqual)
    }

    return false
  }, [data, trace])

  return (
    <Pane borderLeft='default' paddingX={12} marginBottom={12}>
      <Heading is='h4'>
        Tracer de la voie
      </Heading>

      <Alert
        marginTop={8}
        intent='none'
        title='Utilisez la carte pour dessiner le tracer de la voie'
      >
        {modeId === 'drawLineString' ?
          'Cliquez sur la carte pour indiquer le début de la voie, puis ajouter de nouveaux points afin de tracer votre voie. Une fois terminé, cliquez sur le dernier point afin d’indiquer la fin de la voie.' :
          'Modifier le tracé de la voie directement depuis la carte.'}
      </Alert>

      {isModified && (
        <Button
          type='button'
          marginY={8} marginRight={12}
          iconBefore={EditIcon}
          onClick={handleCancel}
        >
          Annuler les modifications
        </Button>
      )}

      {data && (
        <Button
          type='button'
          appearance='primary'
          intent='danger'
          marginY={8} marginRight={12}
          iconBefore={EraserIcon}
          onClick={handleDelete}
        >
          Effacer le tracé
        </Button>
      )}

    </Pane>
  )
}

DrawEditor.defaultProps = {
  trace: null
}

DrawEditor.propTypes = {
  trace: PropTypes.object
}

export default DrawEditor
