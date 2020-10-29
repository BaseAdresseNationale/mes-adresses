
import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import {getBalAccess} from '../lib/tokens'

const RetrieveBALAccess = ({handleBals}) => {
  useEffect(() => {
    const getAccess = async () => {
      const access = await getBalAccess()
      handleBals(access)
    }

    getAccess()
  }, [handleBals])

  return <div />
}

RetrieveBALAccess.propTypes = {
  handleBals: PropTypes.func.isRequired
}

export default RetrieveBALAccess
