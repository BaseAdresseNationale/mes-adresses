import React, {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {sortBy} from 'lodash'
import {Pane, Heading, Paragraph, Button, Table, Text, AddIcon, Alert} from 'evergreen-ui'

import {addCommune, removeCommune, populateCommune} from '../lib/bal-api'
import {getCommune} from '../lib/geo-api'

import TokenContext from '../contexts/token'
import BalDataContext from '../contexts/bal-data'

import useFuse from '../hooks/fuse'

import DeleteWarning from '../components/delete-warning'
import TableRow from '../components/table-row'
import CommuneEditor from '../components/bal/commune-editor'
import {normalizeSort} from '../lib/normalize'

const Index = React.memo(({baseLocale, defaultCommunes}) => {
  const [communes, setCommunes] = useState(defaultCommunes)
  const [isAdding, setIsAdding] = useState(false)
  const [toRemove, setToRemove] = useState(null)

  const {token} = useContext(TokenContext)
  const balDataContext = useContext(BalDataContext)

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
  }, [baseLocale._id, token])

  const onRemove = useCallback(async () => {
    const updated = await removeCommune(baseLocale._id, toRemove, token)

    const updatedCommunes = await Promise.all(
      updated.communes.map(commune => getCommune(commune))
    )

    setCommunes(updatedCommunes)
    setToRemove(null)
  }, [baseLocale._id, toRemove, token])

  const onSelect = useCallback(codeCommune => {
    Router.push(
      `/bal/commune?balId=${baseLocale._id}&codeCommune=${codeCommune}`,
      `/bal/${baseLocale._id}/communes/${codeCommune}`
    )
  }, [baseLocale._id])

  return (
    <>
      <DeleteWarning
        isShown={Boolean(toRemove)}
        content={(
          <Paragraph>
            Êtes vous bien sûr de vouloir supprimer cette commune ainsi que toutes ses voies et numéros ?
          </Paragraph>
        )}
        onCancel={() => setToRemove(null)}
        onConfirm={onRemove}
      />

      <Pane
        display='flex'
        flexDirection='column'
        background='tint1'
        padding={16}
      >
        <Heading>{balDataContext.baseLocale?.nom || baseLocale.nom}</Heading>
        <Text>{communes.length} commune{communes.length > 1 ? 's' : ''}</Text>
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
        {token && communes.length === 0 && (
          <Pane marginLeft='auto'>
            <Button
              iconBefore={AddIcon}
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

      {communes.length > 1 && (
        <Pane padding={16}>
          <Alert
            intent='warning'
            title='Gestion de plusieurs communes'
          >
            L’éditeur « Mes Adresses » permet la gestion d’une Base Adresse Locale à l’échelle communale. Pour gérer plusieurs communes, vous devez créer plusieurs Bases Adresses Locales.
          </Alert>
        </Pane>
      )}

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
          {sortBy(filtered, v => normalizeSort(v.nom))
            .map(commune => (
              <TableRow
                key={commune.code}
                id={commune.code}
                code={commune.code}
                label={commune.nom}
                onSelect={onSelect}
                onRemove={id => setToRemove(id)}
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
      } catch {
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
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  defaultCommunes: PropTypes.array
}

Index.defaultProps = {
  defaultCommunes: null
}

export default Index
