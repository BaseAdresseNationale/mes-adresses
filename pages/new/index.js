import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, TabNavigation, Tab, Paragraph, BackButton} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import CreateForm from './create-form'
import UploadForm from './upload-form'

function Index({defaultCommune}) {
  const [index, setIndex] = useState(0)

  return (
    <Pane backgroundColor='white'>
      <Pane padding={16}>
        <Heading size={600} marginBottom={8}>Nouvelle Base Adresse Locale</Heading>
        <Paragraph>
          Sélectionnez une commune pour laquelle vous souhaitez créer ou modifier une Base Adresse Locale.
        </Paragraph>
      </Pane>

      <TabNavigation marginLeft={16}>
        {['Créer une Base Adresse Locale', 'Créer une Base Adresse Locale à partir d’un fichier CSV'].map((tab, idx) => (
          <Tab key={tab} id={tab} isSelected={index === idx} onSelect={() => setIndex(idx)}>
            {tab}
          </Tab>
        ))}
      </TabNavigation>

      {index === 0 ? (
        <CreateForm defaultCommune={defaultCommune} />
      ) : (
        <UploadForm />
      )}

      <Pane display='flex' flex={1} margin={16} marginTop={32}>
        <BackButton is='a' href='/'>Retour</BackButton>
      </Pane>
    </Pane>
  )
}

Index.getInitialProps = async ({query}) => {
  let defaultCommune
  if (query.commune) {
    defaultCommune = await getCommune(query.commune, {
      fields: 'departement'
    })
  }

  return {
    defaultCommune,
    layout: 'fullscreen'
  }
}

Index.propTypes = {
  defaultCommune: PropTypes.string
}

Index.defaultProps = {
  defaultCommune: null
}

export default Index
