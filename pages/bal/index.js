import React, {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Heading, Button, Table} from 'evergreen-ui'

import {addCommune, removeCommune, populateCommune} from '../../lib/bal-api'
import {getCommune} from '../../lib/geo-api'

import TokenContext from '../../contexts/token'

import useFuse from '../../hooks/fuse'

import TableRow from '../../components/table-row'
import CommuneEditor from '../../components/bal/commune-editor'

const Index = React.memo(({baseLocale, defaultCommunes}) => {
  const [communes, setCommunes] = useState(defaultCommunes)
  const [isAdding, setIsAdding] = useState(false)
  const {token} = useContext(TokenContext)

  const [filtered, onFilter] = useFuse(communes, 200, {
    keys: [
      'nom'
    ]
  })

  const onAdd = useCallback(async ({commune, populate}) => {
    const updated = await addCommune(baseLocale._id, commune, token)

    if (populate) {
      await populateCommune(baseLocale._id, commune, token)
    }

    const updatedCommunes = await Promise.all(
      updated.communes.map(commune => getCommune(commune))
    )

    setIsAdding(false)
    setCommunes(updatedCommunes)
  }, [baseLocale, token])

  const onRemove = useCallback(async codeCommune => {
    const updated = await removeCommune(baseLocale._id, codeCommune, token)

    const updatedCommunes = await Promise.all(
      updated.communes.map(commune => getCommune(commune))
    )

    setCommunes(updatedCommunes)
  }, [baseLocale, token])

  const onSelect = useCallback(codeCommune => {
    Router.push(
      `/bal/commune?balId=${baseLocale._id}&codeCommune=${codeCommune}`,
      `/bal/${baseLocale._id}/communes/${codeCommune}`
    )
  }, [baseLocale])

  return (
    <>
      <Pane
        display='flex'
        background='tint1'
        padding={16}
      >
        <Heading>{baseLocale.nom}</Heading>
      </Pane>
      <Pane
        flexShrink={0}
        elevation={0}
        backgroundColor='white'
        padding={16}
        display='flex'
        alignItems='center'
        minHeight={64}
      >
        <Pane>
          <Heading>Liste des communes</Heading>
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
                <CommuneEditor
                  exclude={communes.map(c => c.code)}
                  onSubmit={onAdd}
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
            <TableRow
              key={commune.code}
              id={commune.code}
              code={commune.code}
              label={commune.nom}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}
        </Table>
      </Pane>
    </>
  )
})

Index.getInitialProps = async ({baseLocale}) => {
  const communes = await Promise.all(
    baseLocale.communes.map(async codeCommune => {
      try {
        return await getCommune(codeCommune)
      } catch (error) {
        return {
          code: codeCommune
        }
      }
    })
  )

  return {
    layout: 'sidebar',
    defaultCommunes: communes,
    baseLocale
  }
}

Index.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired,
  defaultCommunes: PropTypes.array
}

Index.defaultProps = {
  defaultCommunes: null
}

export default Index
