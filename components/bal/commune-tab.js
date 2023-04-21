import {useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import BalDataContext from '@/contexts/bal-data'

import CertificationInfos from './certification-infos'
import HabilitationInfos from './habilitation-infos'

function CommuneTab({commune}) {
  const {baseLocale} = useContext(BalDataContext)

  return (
    <Pane overflowY='auto'>
      {baseLocale.status !== 'demo' && <HabilitationInfos commune={commune} />}
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

