import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, TabNavigation, Tab, Heading, Paragraph, Button} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import LocalStorageContext from '../../contexts/local-storage'

import Header from '../../components/header'
import Footer from '../../components/footer'
import BackButton from '../../components/back-button'

import CreateForm from './create-form'
import UploadForm from './upload-form'
import DemoForm from './demo-form'

function Index({defaultCommune, isDemo}) {
  const {balAccess} = useContext(LocalStorageContext)

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

        {balAccess && (
          <Pane marginLeft={16} marginY={8}>
            <BackButton is='a' href='/'>Retour à la liste de mes Bases Adresses Locales</BackButton>
          </Pane>
        )}
      </Pane>

      {!isDemo && (
        <Pane display='flex' flex={1}>
          <Pane margin='auto' textAlign='center'>
            <Heading marginBottom={8}>Vous voulez simplement essayer l’éditeur sans créer de Base Adresse Locale ?</Heading>
            <Button is='a' href='/new?demo=1'>Essayer l’outil</Button>
          </Pane>
        </Pane>
      )}
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
