import React, {useState} from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {Pane, TabNavigation, Tab, Heading, Paragraph} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import Header from '../../components/header'
import DemoBALAlert from '../../components/demo-bal-alert'
import Footer from '../../components/footer'
import CreateForm from './create-form'
import UploadForm from './upload-form'
import DemoForm from './demo-form'

const BackToUserBals = dynamic(import('./back-to-user-bals'), {
  ssr: false
})

function Index({defaultCommune, isDemo}) {
  const [index, setIndex] = useState(0)

  return (
    <Pane height='100%' display='flex' flexDirection='column'>
      <Header />
      <Pane padding={12}>
        <Heading size={600} marginBottom={8}>{`Nouvelle Base Adresse Locale ${isDemo ? 'de démonstration' : ''}`}</Heading>
        <Paragraph>
          {`Sélectionnez une commune pour laquelle vous souhaitez créer ou modifier une Base Adresse Locale ${isDemo ? ' de démonstration' : ''}.`}
        </Paragraph>
      </Pane>

      <Pane paddingTop={16} flex={1}>
        {isDemo ? (
          <DemoForm defaultCommune={defaultCommune} />
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
                <CreateForm defaultCommune={defaultCommune} />
              ) : (
                <UploadForm />
              )}
            </Pane>
          </>)}

        {!isDemo && (
          <DemoBALAlert />
        )}
        <Pane display='flex' justifyContent='space-between' alignItems='center' flex={1} margin={16} marginTop={32}>
          <BackToUserBals />
        </Pane>
      </Pane>
      <Footer />
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
    isDemo: query.demo === '1',
    layout: 'fullscreen'
  }
}

Index.propTypes = {
  defaultCommune: PropTypes.string,
  isDemo: PropTypes.bool
}

Index.defaultProps = {
  defaultCommune: null,
  isDemo: false
}

export default Index
