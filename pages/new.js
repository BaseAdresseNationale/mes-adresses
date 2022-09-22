import {useState, useContext, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, TabNavigation, Tab, Heading, Paragraph, Button} from 'evergreen-ui'
import Link from 'next/link'

import {getCommune} from '@/lib/geo-api'

import LocalStorageContext from '@/contexts/local-storage'

import {useInput} from '@/hooks/input'

import Main from '@/layouts/main'

import BackButton from '@/components/back-button'
import CreateForm from '@/components/new/create-form'
import UploadForm from '@/components/new/upload-form'
import DemoForm from '@/components/new/demo-form'

const getSuggestedBALName = commune => {
  return commune ? `Adresses de ${commune.nom}` : null
}

function Index({defaultCommune, isDemo}) {
  const {balAccess} = useContext(LocalStorageContext)

  const suggestedBALName = useRef({
    suggested: getSuggestedBALName(defaultCommune),
    prev: null
  })

  const [nom, onNomChange, resetInput] = useInput(suggestedBALName.current.suggested)
  const [email, onEmailChange] = useInput('')
  const [selectedCommune, setSelectedCommune] = useState(defaultCommune)

  const [index, setIndex] = useState(0)

  const Form = index === 0 ? CreateForm : UploadForm

  useEffect(() => {
    suggestedBALName.current = {
      prev: suggestedBALName.current.suggested, // Suggestion for previous commune
      suggested: getSuggestedBALName(selectedCommune), // Current suggestion
      used: false // True when current suggestion has been used
    }
  }, [selectedCommune])

  useEffect(() => {
    const {prev, suggested, used} = suggestedBALName.current
    if ((nom === '' && !used) || nom === prev) {
      resetInput(suggested)
      suggestedBALName.current = {...suggestedBALName.current, used: true}
    }
  }, [nom, selectedCommune, resetInput])

  return (
    <Main>
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
              <Form
                namePlaceholder={suggestedBALName.current.suggested}
                commune={selectedCommune}
                nom={nom}
                onNomChange={onNomChange}
                email={email}
                onEmailChange={onEmailChange}
                handleCommune={setSelectedCommune}
              />
            </Pane>
          </>)}

        {balAccess && (
          <Pane marginLeft={16} marginY={8}>
            <Link href='/' passHref>
              <BackButton is='a'>Retour à la liste de mes Bases Adresses Locales</BackButton>
            </Link>
          </Pane>
        )}
      </Pane>

      {!isDemo && (
        <Pane display='flex' flex={1}>
          <Pane margin='auto' textAlign='center'>
            <Heading marginBottom={8}>Vous voulez simplement essayer l’éditeur sans créer de Base Adresse Locale ?</Heading>
            <Link href='/new?demo=1' passHref>
              <Button is='a'>Essayer l’outil</Button>
            </Link>
          </Pane>
        </Pane>
      )}
    </Main>
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
    isDemo: query.demo === '1'
  }
}

Index.propTypes = {
  defaultCommune: PropTypes.object,
  isDemo: PropTypes.bool
}

Index.defaultProps = {
  defaultCommune: null,
  isDemo: false
}

export default Index
