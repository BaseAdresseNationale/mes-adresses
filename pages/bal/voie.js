import React, {useState, useCallback} from 'react'
import {Pane, Paragraph, Heading, Table, Button} from 'evergreen-ui'

import {addNumero, getNumeros} from '../../lib/bal-api'

import useToken from '../../hooks/token'

import Breadcrumbs from '../../components/breadcrumbs'
import TableRow from '../../components/table-row'
import NumeroEditor from '../../components/bal/numero-editor'

const Voie = React.memo(({baseLocale, commune, voie, defaultNumeros}) => {
  const [numeros, setNumeros] = useState(defaultNumeros)
  const [isAdding, setIsAdding] = useState(false)
  const token = useToken(baseLocale._id)

  const onAdd = useCallback(async ({numero, suffixe}) => {
    await addNumero(voie._id, {
      numero,
      suffixe
    }, token)

    const numeros = await getNumeros(voie._id)

    setIsAdding(false)
    setNumeros(numeros)
  }, [voie, token])

  return (
    <>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor='white'>
        <Breadcrumbs baseLocale={baseLocale} commune={commune} voie={voie} />
        <Pane padding={16} display='flex'>
          <Pane>
            <Heading marginBottom={8}>Liste des numéros</Heading>
            <Paragraph size={300} margin={0} color='muted'>Lorem ipsum…</Paragraph>
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
                Ajouter un numéro
              </Button>
            </Pane>
          )}
        </Pane>
      </Pane>

      <Pane flex={1} overflowY='scroll'>
        <Table>
          {isAdding && (
            <Table.Row height='auto'>
              <Table.Cell borderBottom display='block' paddingY={12} background='tint1'>
                <NumeroEditor
                  onSubmit={onAdd}
                  onCancel={() => setIsAdding(false)}
                />
              </Table.Cell>
            </Table.Row>
          )}
          {numeros.length === 0 && (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                Aucun numéro
              </Table.TextCell>
            </Table.Row>
          )}
          {numeros.map(numero => (
            <TableRow
              key={numero._id}
              isSelectable={false}
              id={numero._id}
              label={`${numero.numero} ${numero.suffixe}`}
            />
          ))}
        </Table>
      </Pane>
    </>
  )
})

Voie.getInitialProps = ({baseLocale, commune, voie, numeros}) => {
  return {
    layout: 'sidebar',
    baseLocale,
    commune,
    voie,
    defaultNumeros: numeros
  }
}

export default Voie
