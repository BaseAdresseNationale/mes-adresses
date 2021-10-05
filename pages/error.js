import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Button, Icon, ArrowLeftIcon, RouteIcon} from 'evergreen-ui'

import Header from '../components/header'

function NotFound({statusCode}) {
  return (
    <Pane display='flex' backgroundColor='#fff' flexDirection='column' width='100%' height='100%'>
      <Header />
      <Pane
        display='flex'
        alignItems='center'
        flexDirection='column'
        justifyContent='center'
        height='50%'
      >
        <Icon icon={RouteIcon} size={100} marginX='auto' marginY={16} color='#101840' />
        <Heading size={800} marginBottom='2em'>Erreur {statusCode} - {statusCode === 404 ? 'Page introuvable' : 'Une erreur est survenue'}</Heading>
        <Button href='/' iconBefore={ArrowLeftIcon}>
          Retour à la page d’accueil
        </Button>
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
