import React, {useState, useMemo, useCallback} from 'react'
import {Pane, Card, Heading, Paragraph} from 'evergreen-ui'

import {list} from '../lib/bal'

import CommuneSearch from '../components/commune-search'

function Index({bals}) {
  const [commune, setCommune] = useState()

  const onSelect = useCallback(commune => {
    setCommune(commune)
  }, [])

  const matchingBals = useMemo(() => {
    return commune ? bals.filter(bal => bal.communes.includes(commune.code)) : []
  }, [bals, commune])

  const balCountLabel = useMemo(() => {
    switch (matchingBals.length) {
      case 0:
        return 'Aucune Base Adresse Locale ne contient cette commune.'

      case 1:
        return 'Une Base Adresse Locale contient cette commune :'

      default:
        return `${matchingBals.length} Bases Adresse Locales contiennent cette commune :`
    }
  }, [matchingBals])

  return (
    <Pane paddingX={16} paddingBottom={16}>
      <Heading size={600} margin='default'>Créer ou modifier une Base Adresse Locale</Heading>
      <Paragraph marginBottom={16}>
        Sélectionnez une commune pour laquelle vous souhaitez créer ou modifier une Base Adresse Locale.
      </Paragraph>
      <CommuneSearch
        placeholder='Rechercher une commune…'
        width='100%'
        onSelect={onSelect}
      />
      {commune && (
        <Pane borderTop marginTop={16} paddingTop={12}>
          <Paragraph size={300} color='muted' marginBottom={12}>{balCountLabel}</Paragraph>

          {matchingBals.map(bal => (
            <Card key={bal._id} border padding={12} background='tint1'>
              <Paragraph>{bal.nom}</Paragraph>
            </Card>
          ))}
        </Pane>
      )}
    </Pane>
  )
}

Index.getInitialProps = async () => {
  const bals = await list()

  return {
    bals,
    layout: 'fullscreen'
  }
}

export default Index
