import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Text} from 'evergreen-ui'
import {computeCompletNumero} from '../../lib/utils/numero'

const getAddressPreview = (numero, suffixe, toponyme, voie, commune) => {
  const completNumero = computeCompletNumero(numero, suffixe)
  if (toponyme) {
    return `${completNumero} ${voie}, ${toponyme} - ${commune.nom} (${commune.code})`
  }

  if (voie) {
    return `${completNumero} ${voie} - ${commune.nom} (${commune.code})`
  }

  if (!voie && !toponyme) {
    return `${completNumero} - ${commune.nom} (${commune.code})`
  }

  return `${completNumero} ${voie} - ${commune.nom} (${commune.code})`
}

function AddressPreview({isSidebar, numero, suffixe, selectedNomToponyme, voie, commune}) {
  return isSidebar ? (
    <Pane position='fixed' width={500} left={0} transition='left 0.3s' zIndex={3} background='blue100' paddingY={8} paddingX={12} marginTop={-12}>
      <Text fontSize={13}>
        {getAddressPreview(numero, suffixe, selectedNomToponyme, voie, commune)}
      </Text>
    </Pane>
  ) : (
    <Pane position='fixed' width='100%' boxSizing='border-box' bottom={0} zIndex={3} background='blue100' paddingY={8} paddingX={12} marginLeft={-20}>
      <Text fontSize={13}>
        {getAddressPreview(numero, suffixe, selectedNomToponyme, voie, commune)}
      </Text>
    </Pane>
  )
}

AddressPreview.propTypes = {
  isSidebar: PropTypes.bool,
  numero: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  suffixe: PropTypes.string,
  selectedNomToponyme: PropTypes.string,
  voie: PropTypes.string,
  commune: PropTypes.object.isRequired
}

AddressPreview.defaultProps = {
  isSidebar: false,
  numero: '',
  suffixe: '',
  selectedNomToponyme: '',
  voie: ''
}

export default AddressPreview
