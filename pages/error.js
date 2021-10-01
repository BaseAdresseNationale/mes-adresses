import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import Image from 'next/image'
import {Pane, Heading} from 'evergreen-ui'

import IncidentOvh404 from '../components/incident-ovh/not-found'

function NotFound({statusCode}) {
  return (
    <Pane display='flex' backgroundColor='#fff' flexDirection='column' width='100%' height='100%'>
      <Pane borderBottom padding={16} backgroundColor='white' display='flex' justifyContent='space-between' alignItems='center' flexShrink='0' width='100%' maxHeight={76}>
        <Pane cursor='pointer'>
          <NextLink href='/'>
            <a>
              <Image className='img' height='34' width='304' src='/static/images/mes-adresses.svg' alt='Page d’accueil du site mes-adresses.data.gouv.fr' />
            </a>
          </NextLink>
        </Pane>
      </Pane>

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
