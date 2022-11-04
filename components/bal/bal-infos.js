import {useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading} from 'evergreen-ui'

import BalDataContext from '@/contexts/bal-data'

import Counter from '@/components/counter'
import CertificationInfos from '@/components/bal/certification-infos'

function BalInfos({nbVoies, nbToponymes}) {
  const {baseLocale} = useContext(BalDataContext)
  const {nbNumeros} = baseLocale

  return (
    <Pane
      display='flex'
      flexDirection='column'
      padding={15}
      overflow='auto'
    >
      <Heading size={600} textAlign='center' paddingY={10}>Les adresses de la commune en quelques chiffres :</Heading>
      <Pane display='flex' justifyContent='center'>
        <Counter label='numéros' value={nbNumeros} hasBorder hasBigLabel color='#2053b3' />
        <Counter label='voies' value={nbVoies} hasBorder hasBigLabel color='#2053b3' />
        <Counter label='toponymes' value={nbToponymes} hasBorder hasBigLabel color='#2053b3' />
      </Pane>
      <CertificationInfos />
    </Pane>
  )
}

BalInfos.defaultProps = {
  nbVoies: 0,
  nbToponymes: 0
}

BalInfos.propTypes = {
  nbVoies: PropTypes.number,
  nbToponymes: PropTypes.number
}

export default BalInfos
