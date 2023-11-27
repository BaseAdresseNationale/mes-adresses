import React, {useContext} from 'react'
import {Pane} from 'evergreen-ui'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import CertificationInfos from './certification-infos'
import HabilitationInfos from './habilitation-infos'
import ReadOnlyInfos from './read-only-infos'
import {CommuneType} from '@/types/commune'

interface CommuneTabProps {
  commune: CommuneType;
  openRecoveryDialog: () => void;
}

function CommuneTab({commune, openRecoveryDialog}: CommuneTabProps) {
  const {baseLocale} = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  return (
    <Pane overflowY='auto'>
      {!token && <ReadOnlyInfos openRecoveryDialog={openRecoveryDialog} />}
      {token && baseLocale.status !== 'demo' && <HabilitationInfos commune={commune} />}
      <CertificationInfos openRecoveryDialog={!token && openRecoveryDialog} />
    </Pane>
  )
}

export default CommuneTab

