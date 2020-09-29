import React, {useState} from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {Pane, TabNavigation, Tab} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import FullscreenContainer from '../../components/fullscreen-container'

import CreateForm from './create-form'
import UploadForm from './upload-form'
import TestForm from './test-form'

const BackToUserBals = dynamic(import('./back-to-user-bals'), {
  ssr: false
})

function Index({defaultCommune, isTest}) {
  const [index, setIndex] = useState(0)

  return (
    <FullscreenContainer
      title={`Nouvelle Base Adresse Locale ${isTest ? 'de démonstration' : ''}`}
      subtitle={`Sélectionnez une commune pour laquelle vous souhaitez créer ou modifier une Base Adresse Locale ${isTest ? ' de démonstration' : ''}.`}
    >
      <Pane paddingTop={16} flex={1}>
        {isTest ? (
          <TestForm defaultCommune={defaultCommune} />
        ) :
          (<>
            <TabNavigation display='flex' marginLeft={16}>
              {['Créer', 'Importer un fichier CSV'].map((tab, idx) => (
                <Tab key={tab} id={tab} isSelected={index === idx} onSelect={() => setIndex(idx)}>
                  {tab}
                </Tab>
              ))}
            </TabNavigation>

            <Pane flex={1} overflowY='scroll'>
              {index === 0 ? (
                <CreateForm defaultCommune={defaultCommune} isTest={isTest} />
              ) : (
                <UploadForm />
              )}
            </Pane>
          </>)}

        <Pane display='flex' justifyContent='space-between' alignItems='center' flex={1} margin={16} marginTop={32}>
          <BackToUserBals />
        </Pane>
      </Pane>
    </FullscreenContainer>
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
    isTest: query.test === '1',
    layout: 'fullscreen'
  }
}

Index.propTypes = {
  defaultCommune: PropTypes.string,
  isTest: PropTypes.bool
}

Index.defaultProps = {
  defaultCommune: null,
  isTest: false
}

export default Index
