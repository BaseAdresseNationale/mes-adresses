import React from 'react'
import NextLink from 'next/link'
import {Pane, Heading, Link, Text, Table} from 'evergreen-ui'

import {voieNumerosToGeoJson} from '../../lib/geojson'

import Storage from '../../lib/storage'

function Voie({balId, commune, voie}) {
  return (
    <>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor='white'>
        <Pane paddingY={4} paddingX={16} borderBottom='muted' background='tint1'>
          <NextLink href={`/bal?id=${balId}`} as={`/bal/${balId}`}>
            <Link display='inline-block' href={`/bal/${balId}`} marginY={6}>
              BAL
            </Link>
          </NextLink>
          <Text color='muted'>{' > '}</Text>
          <NextLink href={`/bal/commune?id=${balId}&communeCode=${commune.code}`} as={`/bal/${balId}/communes/${commune.code}`}>
            <Link display='inline-block' href={`/bal/${balId}/communes/${commune.code}`} marginY={6}>
              {commune.nom}
            </Link>
          </NextLink>
          <Text color='muted'>{' > '}</Text>
          <Text>{voie.nomVoie}</Text>
        </Pane>
        <Pane paddingX={16} paddingY={22}>
          <Heading>Liste des numéros</Heading>
        </Pane>
      </Pane>
      <Pane flex={1} overflowY='scroll'>
        <Table>
          {Object.values(voie.numeros).map(numero => (
            <Table.Row key={numero.numeroComplet} isSelectable onSelect={() => alert(numero)}>
              <Table.TextCell>{numero.numeroComplet}</Table.TextCell>
              <Table.TextCell flex='0 1 1'>
                {voie.source.join(', ')}
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table>
      </Pane>
    </>
  )
}

Voie.getInitialProps = async ({query}) => {
  const {id, communeCode, codeVoie} = query

  if (id) {
    const bal = Storage.get(id)

    if (bal) {
      const commune = bal.communes[communeCode]
      const voie = commune.voies[codeVoie]

      return {
        layout: 'sidebar',
        balId: id,
        commune,
        voie,
        map: {
          sources: [
            {
              name: 'numeros',
              data: voieNumerosToGeoJson(voie)
            }
          ],
          layers: [
            {
              id: 'numeros',
              type: 'symbol',
              source: 'numeros',
              minzoom: 10,
              paint: {
                'text-color': '#ffffff',
                'text-halo-color': '#0081d5',
                'text-halo-width': 1.7
              },
              layout: {
                'text-font': ['Roboto Regular'],
                'text-field': '{numeroComplet}',
                'text-ignore-placement': true
              }
            }
          ]
        }
      }
    }
  }
}

export default Voie
