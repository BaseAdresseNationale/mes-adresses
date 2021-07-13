import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Text, Strong} from 'evergreen-ui'

import {getCommune} from '../lib/geo-api'

function PreviewAdresse({numero, suffixe, voie, toponyme, codeCommune}) {
  const [commune, setCommune] = useState(null)

  useEffect(() => {
    async function fetchCommune(codeCommune) {
      const commune = await getCommune(codeCommune)
      setCommune(commune)
    }

    fetchCommune(codeCommune)
  }, [codeCommune])

  return (
    <Pane
      border
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      background='tint2'
      borderRadius={4}
      paddingX={12}
      paddingY={4}
      marginY={8}
    >
      <Text size={500}>Aperçu :</Text>
      <Pane display='flex' flexDirection='column' alignItems='flex-end'>
        <Pane>
          {numero ? <Strong>{numero}</Strong> : <Text color='muted'>Numéro</Text>}
          {suffixe && <Strong>{suffixe}</Strong>}
          {voie ? <Strong> {voie}</Strong> : <Text color='muted'> Voie</Text>}
          {toponyme && <Strong>, {toponyme}</Strong>}
        </Pane>
        <Pane>
          <Text>{codeCommune} - </Text>
          <Text>{commune?.nom}</Text>
        </Pane>
      </Pane>
    </Pane>
  )
}

PreviewAdresse.defaultProps = {
  numero: null,
  suffixe: null,
  voie: null,
  toponyme: null
}

PreviewAdresse.propTypes = {
  numero: PropTypes.string,
  suffixe: PropTypes.string,
  voie: PropTypes.string,
  toponyme: PropTypes.string,
  codeCommune: PropTypes.string.isRequired
}

export default PreviewAdresse
