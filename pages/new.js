import {useState, useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, TabNavigation, Tab, Heading, Paragraph, Button} from 'evergreen-ui'
import Link from 'next/link'
import {uniqBy} from 'lodash'

import {getCommune} from '@/lib/geo-api'
import {createBaseLocale, searchBAL} from '@/lib/bal-api'

import LocalStorageContext from '@/contexts/local-storage'

import Main from '@/layouts/main'

import {useInput} from '@/hooks/input'

import BackButton from '@/components/back-button'
import CreateForm from '@/components/new/create-form'
import UploadForm from '@/components/new/upload-form'
import DemoForm from '@/components/new/demo-form'

function Index({defaultCommune, isDemo}) {
  const {addBalAccess, balAccess} = useContext(LocalStorageContext)

  const [bal, setBal] = useState(null)
  const [index, setIndex] = useState(0)
  const [nom, onNomChange] = useInput(
    defaultCommune ? `Adresses de ${defaultCommune.nom}` : ''
  )
  const [email, onEmailChange] = useInput('')
  const [userBALs, setUserBALs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const [selectedCodeCommune, setSelectedCodeCommune] = useState(defaultCommune ? defaultCommune.code : null)

  const Form = index === 0 ? CreateForm : UploadForm

  const createNewBal = useCallback(async codeCommune => {
    if (codeCommune && !bal) {
      const baseLocale = await createBaseLocale({
        nom,
        commune: codeCommune,
        emails: [
          email
        ]
      })

      addBalAccess(baseLocale._id, baseLocale.token)
      setBal(baseLocale)
    }
  }, [bal, nom, email, addBalAccess])

  const checkUserBALs = useCallback(async () => {
    const userBALs = []

    const basesLocales = await searchBAL(selectedCodeCommune, email)

    if (basesLocales.length > 0) {
      userBALs.push(...basesLocales)
    }

    if (basesLocales.length > 0) {
      const uniqUserBALs = uniqBy(userBALs, '_id')

      setUserBALs(uniqUserBALs)
      setIsShown(true)
    } else {
      await createNewBal(selectedCodeCommune)
    }
  }, [selectedCodeCommune, email, createNewBal])

  const onSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    await checkUserBALs()
  }

  const onCancel = () => {
    setIsShown(false)
    setIsLoading(false)
  }

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
                defaultCommune={defaultCommune}
                selectedCodeCommune={selectedCodeCommune}
                setSelectedCodeCommune={setSelectedCodeCommune}
                nom={nom}
                onNomChange={onNomChange}
                email={email}
                onEmailChange={onEmailChange}
                bal={bal}
                userBALs={userBALs}
                onCancel={onCancel}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                isShown={isShown}
                setIsShown={setIsShown}
                checkUserBALs={checkUserBALs}
                createNewBal={createNewBal}
                onSubmit={onSubmit}
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
