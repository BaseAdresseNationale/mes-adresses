import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading} from 'evergreen-ui'

import Header from '../components/header'

import IncidentOvh404 from '../components/incident-ovh/not-found'

function NotFound({statusCode}) {
  return (
    <Pane display='flex' backgroundColor='#fff' flexDirection='column' width='100%' height='100%'>
      <Header />
      <Pane
        display='flex'
        alignItems='center'
        flexDirection='column'
        justifyContent='center'
        border='default'
        height='100%'
      >
        <Heading size={600} marginBottom='2em'>Erreur {statusCode} - {statusCode === 404 ? 'Page introuvable' : 'Une erreur est survenue'}</Heading>
        {statusCode === 404 && (
          <Pane width='80%'>
            <IncidentOvh404 hasRedirection />
          </Pane>
        )}
      </Pane>
    </Pane>
  )
}

NotFound.propTypes = {
  statusCode: PropTypes.number.isRequired
}

NotFound.getInitialProps = ({res, err}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return {statusCode}
}

export default NotFound
