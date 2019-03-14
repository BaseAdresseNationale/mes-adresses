import React, {useState, useCallback} from 'react'
import Router from 'next/router'
import {Pane, Heading, Button, Table, Paragraph} from 'evergreen-ui'

import {getBaseLocale, addCommune, populateCommune} from '../../lib/bal-api'
import {getCommune} from '../../lib/geo-api'

import useToken from '../../hooks/token'
import useFuse from '../../hooks/fuse'

import CommuneAdd from '../../components/bal/commune-add'

const Index = React.memo(({baseLocale, bal}) => {
  const [communes, setCommunes] = useState(bal.communes)
  const [isAdding, setIsAdding] = useState(false)
  const token = useToken(baseLocale._id)

  const [filtered, onFilter] = useFuse(communes, 200, {
    keys: [
      'nom'
    ]
  })

  const onCommuneAdd = useCallback(async ({commune, populate}) => {
    setIsAdding(false)

    const updated = await addCommune(baseLocale._id, commune, token)

    if (populate) {
      try {
        await populateCommune(baseLocale._id, commune, token)
      } catch (error) {
        console.log('Not implemented yet')
      }
    }

    const updatedCommunes = await Promise.all(
      updated.communes.map(commune => getCommune(commune))
    )

    setCommunes(updatedCommunes)
  }, [baseLocale, token])

  const onSelect = commune => {
    Router.push(
      `/bal/commune?balId=${baseLocale._id}&codeCommune=${commune.code}`,
      `/bal/${baseLocale._id}/communes/${commune.code}`
    )
  }

  return (
    <>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor='white'>
        <Pane padding={16} display='flex'>
          <Pane>
            <Heading>{baseLocale.nom}</Heading>
            <Paragraph size={300} margin={0} color='muted'>{baseLocale.description || 'Base Adresse Locale'}</Paragraph>
          </Pane>
          {token && (
            <Pane marginLeft='auto'>
              <Button
                iconBefore='add'
                appearance='primary'
                intent='success'
                disabled={isAdding}
                onClick={() => setIsAdding(true)}
              >
                Ajouter une commune
              </Button>
            </Pane>
          )}
        </Pane>
      </Pane>
      <Pane flex={1} overflowY='scroll'>
        <Table>
          <Table.Head>
            <Table.SearchHeaderCell
              disabled={isAdding}
              placeholder='Rechercher une commune…'
              onChange={onFilter}
            />
          </Table.Head>
          {isAdding && (
            <Table.Row height='auto'>
              <Table.Cell borderBottom display='block' paddingY={12} background='tint1'>
                <CommuneAdd
                  exclude={communes.map(c => c.code)}
                  onSubmit={onCommuneAdd}
                  onCancel={() => setIsAdding(false)}
                />
              </Table.Cell>
            </Table.Row>
          )}
          {filtered.length === 0 && (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                Aucun résultat
              </Table.TextCell>
            </Table.Row>
          )}
          {filtered.map(commune => (
            <Table.Row key={commune.code} isSelectable onSelect={() => onSelect(commune)}>
              <Table.TextCell isNumber flex='0 1 1'>{commune.code}</Table.TextCell>
              <Table.TextCell>{commune.nom}</Table.TextCell>
              <Table.TextCell flex='0 1 1'>
                {!commune.voiesCount && 'aucune voie'}
                {commune.voiesCount === 1 && 'une voie'}
                {commune.voiesCount > 1 && `${commune.voiesCount} voies`}
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table>
      </Pane>
    </>
  )
})

Index.getInitialProps = async ({baseLocale}) => {
  const communes = await Promise.all(
    baseLocale.communes.map(commune => getCommune(commune))
  )

  return {
    layout: 'fullscreen',
    baseLocale,
    bal: {
      id: baseLocale._id,
      communes
    }
  }
}

export default Index
