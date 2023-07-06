import {useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import CertificationInfos from './certification-infos'
import HabilitationInfos from './habilitation-infos'

function CommuneTab({commune}) {
  const {baseLocale} = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  const isHabilitationInfosDisplayed = Boolean(token) && baseLocale.status !== 'demo'

  return (
    <Pane overflowY='auto'>
      {isHabilitationInfosDisplayed && <HabilitationInfos commune={commune} />}
      <CertificationInfos />
    </Pane>
  )
}

CommuneTab.propTypes = {
  commune: PropTypes.shape({
    isCOM: PropTypes.bool.isRequired,
  }).isRequired,
}

export default CommuneTab

