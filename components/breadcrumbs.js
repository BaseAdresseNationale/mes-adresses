import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import {Pane, Link, Text} from 'evergreen-ui'

function Breadcrumbs({bal}) {
  return (
    <Pane paddingY={4} paddingX={16} borderBottom='muted' background='tint1'>
      <NextLink href={`/bal?id=${bal.id}`} as={`/bal/${bal.id}`}>
        <Link display='inline-block' href={`/bal/${bal.id}`} marginY={6}>
          BAL
        </Link>
      </NextLink>
      {bal.voie ? (
        <>
          <Text color='muted'>{' > '}</Text>
          <NextLink href={`/bal/commune?id=${bal.id}&communeCode=${bal.commune.code}`} as={`/bal/${bal.id}/communes/${bal.commune.code}`}>
            <Link display='inline-block' href={`/bal/${bal.id}/communes/${bal.commune.code}`} marginY={6}>
              {bal.commune.nom}
            </Link>
          </NextLink>
          <Text color='muted'>{' > '}</Text>
          <Text>{bal.voie.nomVoie}</Text>
        </>
      ) : (
        <>
          <Text color='muted'>{' > '}</Text>
          <Text>{bal.commune.nom}</Text>
        </>
      )}
    </Pane>
  )
}

Breadcrumbs.propTypes = {
  bal: PropTypes.shape({
    id: PropTypes.string.isRequired,

    commune: PropTypes.shape({
      code: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired
    }).isRequired,

    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired
    })
  }).isRequired
}

export default Breadcrumbs
