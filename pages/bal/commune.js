import React, {useState, useEffect, useRef} from 'react'
import NextLink from 'next/link'
import Router from 'next/router'
import Fuse from 'fuse.js'
import {debounce} from 'lodash'
import {Pane, SearchInput, Table, Link, Text} from 'evergreen-ui'

import Storage from '../../lib/storage'
import {communeNumerosToGeoJson, communeVoiesToGeoJson} from '../../lib/geojson'

function Commune({balId, commune, voies}) {
  const fuse = useRef()
  const [shownVoies, setShownVoies] = useState(voies)

  useEffect(() => {
    fuse.current = new Fuse(voies, {
      shouldSort: true,
      threshold: 0.4,
      keys: [
        'nomVoie'
      ]
    })
  }, [voies])

  const onSelect = voie => {
    Router.push(
      `/bal/voie?id=${balId}&communeCode=${commune.code}&codeVoie=${voie.codeVoie}`,
      `/bal/${balId}/communes/${commune.code}/voies/${voie.codeVoie}`
    )
  }

  const onFilter = debounce(value => {
    if (fuse.current) {
      if (value) {
        setShownVoies(fuse.current.search(value))
      } else {
        setShownVoies(voies)
      }
    }
  }, 200)

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
          <Text>{commune.nom}</Text>
        </Pane>
        <Pane padding={16}>
          <SearchInput placeholder='Rechercher une voie…' onChange={e => onFilter(e.target.value)} />
        </Pane>
      </Pane>
      <Pane flex={1} overflowY='scroll'>
        <Table>
          {shownVoies.length === 0 && (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                Aucun résultat
              </Table.TextCell>
            </Table.Row>
          )}
          {shownVoies.map(voie => (
            <Table.Row key={voie.codeVoie} isSelectable onSelect={() => onSelect(voie)}>
              <Table.TextCell>{voie.nomVoie}</Table.TextCell>
              <Table.TextCell flex='0 1 1'>
                {voie.position ? 'Toponyme' : `${voie.numerosCount} numéros`}
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table>
      </Pane>
    </>
  )
}

Commune.getInitialProps = async ({query}) => {
  const {id, communeCode} = query

  if (id) {
    const bal = Storage.get(id)

    if (bal) {
      const commune = bal.communes[communeCode]
      const voies = Object.values(commune.voies).map(({numeros, ...voie}) => voie)

      return {
        layout: 'sidebar',
        balId: id,
        commune,
        voies,
        map: {
          sources: [
            {
              name: 'numeros',
              data: communeNumerosToGeoJson(commune)
            },
            {
              name: 'voies',
              data: communeVoiesToGeoJson(commune)
            }
          ],
          layers: [
            {
              id: 'numeros-point',
              type: 'circle',
              source: 'numeros',
              maxzoom: 17,
              paint: {
                'circle-color': {
                  type: 'identity',
                  property: 'color'
                },
                'circle-radius': {
                  stops: [
                    [12, 0.5],
                    [17, 4]
                  ]
                }
              }
            },

            {
              id: 'voies',
              type: 'symbol',
              source: 'voies',
              maxzoom: 17,
              paint: {
                'text-halo-blur': 0.5,
                'text-halo-color': '#ffffff',
                'text-halo-width': 2
              },
              layout: {
                'text-field': [
                  'format',

                  ['get', 'nomVoie'],
                  {'font-scale': 0.9},

                  [
                    'case',
                    ['==', ['get', 'numerosCount'], 0],
                    '\nToponyme',
                    ['==', ['get', 'numerosCount'], '1'],
                    '\n1 numéro',
                    ['concat', '\n', ['get', 'numerosCount'], ' numéros']
                  ],
                  {'font-scale': 0.7}
                ],
                'text-anchor': 'top',
                'text-font': ['Noto Sans Regular']
              }
            },

            {
              id: 'numeros',
              type: 'symbol',
              source: 'numeros',
              minzoom: 17,
              paint: {
                'text-color': '#ffffff',
                'text-halo-color': {
                  type: 'identity',
                  property: 'color'
                },
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

export default Commune
