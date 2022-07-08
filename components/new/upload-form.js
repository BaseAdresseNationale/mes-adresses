import {useState, useCallback, useEffect, useContext} from 'react'
import Router from 'next/router'
import {validate} from '@ban-team/validateur-bal'
import {uniqBy} from 'lodash'
import {Pane, Alert, Button, Dialog, TextInputField, Text, Strong, FormField, PlusIcon, InboxIcon, Paragraph, ShareIcon} from 'evergreen-ui'

import {createBaseLocale, uploadBaseLocaleCsv, searchBAL} from '@/lib/bal-api'

import LocalStorageContext from '@/contexts/local-storage'

import useFocus from '@/hooks/focus'
import {useInput} from '@/hooks/input'

import Form from '@/components/form'
import FormInput from '@/components/form-input'
import Uploader from '@/components/uploader'
import SelectCommune from '@/components/select-commune'
import AlertPublishedBAL from '@/components/new/alert-published-bal'

const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'https://adresse.data.gouv.fr'

const MAX_SIZE = 10 * 1024 * 1024

const VALIDATEUR_LINK_TEXT = <Text>Pour obtenir un rapport détaillé des erreurs qui on était détectées, consultez <a href={`${ADRESSE_URL}/bases-locales/validateur`} target='_blank' rel='noreferrer'>le validateur de Bases Adresses Locales <ShareIcon verticalAlign='middle' /></a>.</Text>

function getFileExtension(name) {
  const pos = name.lastIndexOf('.')
  if (pos > 0) {
    return name.slice(pos + 1)
  }

  return null
}

function extractCommuneCodeFromRow({parsedValues, additionalValues}) {
  return parsedValues.commune_insee || additionalValues?.cle_interop?.codeCommune
}

function extractCommuneFromCSV(rows) {
  // Get cle_interop and slice it to get the commune's code
  const communes = rows.map(({parsedValues, additionalValues}) => (
    {
      code: extractCommuneCodeFromRow({parsedValues, additionalValues}),
      nom: parsedValues.commune_nom
    }
  ))

  return uniqBy(communes, 'code')
}

function UploadForm() {
  const [bal, setBal] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange] = useInput('')
  const [email, onEmailChange] = useInput('')
  const [focusRef] = useFocus()
  const [userBALs, setUserBALs] = useState([])
  const [isShown, setIsShown] = useState(false)
  const [communes, setCommunes] = useState(null)
  const [selectedCodeCommune, setSelectedCodeCommune] = useState(null)
  const [validationReport, setValidationReport] = useState(null)
  const [invalidRowsCount, setInvalidRowsCount] = useState(null)

  const {addBalAccess} = useContext(LocalStorageContext)

  const onDrop = async ([file]) => {
    setError(null)
    setCommunes(null)
    setSelectedCodeCommune(null)

    if (file) {
      if (getFileExtension(file.name).toLowerCase() !== 'csv') {
        return onError('Ce type de fichier n’est pas supporté. Vous devez déposer un fichier CSV.')
      }

      // Detect multi communes
      const validationReport = await validate(file, {relaxFieldsDetection: true})
      const communes = extractCommuneFromCSV(validationReport.rows)

      if (communes[0]) {
        setSelectedCodeCommune(communes[0].code)
        if (communes.length > 1) {
          setCommunes(communes)
        }

        setValidationReport(validationReport)
        setFile(file)
      } else {
        onError('Aucune commune n’a pu être trouvée.')
      }
    }
  }

  const onDropRejected = rejectedFiles => {
    const [file] = rejectedFiles

    if (rejectedFiles.length > 1) {
      onError('Vous ne pouvez déposer qu’un seul fichier.')
    } else if (file.size > MAX_SIZE) {
      return onError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 10 Mo.')
    } else {
      onError('Impossible de déposer ce fichier')
    }
  }

  const createNewBal = useCallback(async codeCommune => {
    if (!bal) {
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
  }, [bal, email, nom, addBalAccess])

  const resetForm = () => {
    setFile(null)
    setIsShown(false)
    setIsLoading(false)
    setCommunes(null)
    setSelectedCodeCommune(null)
    setValidationReport(null)
    setInvalidRowsCount(null)
  }

  const onError = useCallback(error => {
    resetForm()
    setError(error)
  }, [])

  const onCancel = () => {
    resetForm()
    setError(null)
  }

  const onSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    await checkUserBALs()
  }

  const checkUserBALs = useCallback(async () => {
    const userBALs = []

    const basesLocales = await searchBAL(selectedCodeCommune, email)
    if (basesLocales.length > 0) {
      userBALs.push(...basesLocales)
    }

    if (userBALs.length > 0) {
      const uniqUserBALs = uniqBy(userBALs, '_id')

      setUserBALs(uniqUserBALs)
      setIsShown(true)
    } else {
      createNewBal(selectedCodeCommune)
    }
  }, [createNewBal, email, selectedCodeCommune])

  useEffect(() => {
    if (selectedCodeCommune && validationReport) {
      // Get invalid rows of selected commune
      const invalidRowsCount = validationReport.rows.filter(row => !row.isValid && extractCommuneCodeFromRow(row) === selectedCodeCommune).length
      setInvalidRowsCount(invalidRowsCount)
    }
  }, [selectedCodeCommune, validationReport])

  useEffect(() => {
    async function upload() {
      try {
        const response = await uploadBaseLocaleCsv(bal._id, file, bal.token)
        if (response.isValid) {
          Router.push(
            `/bal?balId=${bal._id}`,
            `/bal/${bal._id}`
          )
        } else {
          onError(VALIDATEUR_LINK_TEXT)
        }
      } catch (error) {
        setError(error.message)
      }
    }

    if (file && bal && selectedCodeCommune) {
      setIsLoading(true)
      upload()
    }
  }, [bal, selectedCodeCommune, file, onError])

  useEffect(() => {
    if (file || error) {
      setIsLoading(false)
    }
  }, [error, file])

  return (
    <>
      <Pane marginY={32} flex={1} overflowY='scroll'>
        <Form onFormSubmit={onSubmit}>
          {userBALs.length > 0 && (
            <AlertPublishedBAL
              isShown={isShown}
              userEmail={email}
              basesLocales={userBALs}
              updateBAL={() => checkUserBALs(email)}
              onConfirm={() => createNewBal(selectedCodeCommune)}
              onClose={() => onCancel()}
            />
          )}

          <Pane display='flex' flexDirection='row'>
            <Pane flex={1} maxWidth={600}>
              <FormInput>
                <TextInputField
                  ref={focusRef}
                  required
                  autoComplete='new-password' // Hack to bypass chrome autocomplete
                  name='nom'
                  id='nom'
                  marginBottom={0}
                  value={nom}
                  disabled={isLoading}
                  label='Nom de la Base Adresse Locale'
                  placeholder='Nom'
                  onChange={onNomChange}
                />
              </FormInput>

              <FormInput>
                <TextInputField
                  required
                  type='email'
                  name='email'
                  id='email'
                  marginBottom={0}
                  value={email}
                  disabled={isLoading}
                  label='Votre adresse email'
                  placeholder='nom@example.com'
                  onChange={onEmailChange}
                />
              </FormInput>
            </Pane>

            <Pane flex={1} marginLeft={16}>
              <FormInput>
                <FormField label='Fichier CSV' />
                <Uploader
                  file={file}
                  maxSize={MAX_SIZE}
                  height={150}
                  marginBottom={24}
                  placeholder='Sélectionnez ou glissez ici votre fichier BAL au format CSV (maximum 10 Mo)'
                  loadingLabel='Analyse en cours'
                  disabled={isLoading}
                  onDrop={onDrop}
                  onDropRejected={onDropRejected}
                />
              </FormInput>
            </Pane>
          </Pane>

          {communes && (
            <Alert marginBottom={16} intent='warning' title='Attention'>
              <Text>
                Le fichier comporte plusieurs communes. Pour gérer plusieurs communes, vous devez créer plusieurs Bases Adresses Locales. Veuillez choisir une commune, puis validez à nouveau le formulaire.
              </Text>
              <SelectCommune
                communes={communes}
                selectedCodeCommune={selectedCodeCommune}
                setSelectedCodeCommune={setSelectedCodeCommune}
              />
            </Alert>
          )}

          <Dialog
            isShown={invalidRowsCount > 0}
            title='Le fichier comporte des erreurs'
            intent='danger'
            onConfirm={() => setInvalidRowsCount(null)}
            onCancel={onCancel}
            confirmLabel='Utiliser uniquement les adresses conformes'
            cancelLabel='Annuler'
            hasClose={false}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEscapePress={false}
          >
            <Paragraph>
              {invalidRowsCount > 1 ? (
                <><Strong>{invalidRowsCount} lignes comportent au moins une erreur</Strong> et ne pourront pas être importées dans votre Base Adresse Locale.</>
              ) : (
                <><Strong>1 ligne comporte au moins une erreur</Strong> et ne pourra pas être importée dans votre Base Adresse Locale.</>
              )}
            </Paragraph>

            <Paragraph marginTop={8}>
              En continuant, seules les adresses conformes seront utilisées  pour créer votre Base Adresse Locale.
            </Paragraph>

            <Alert title='Plus d’informations' marginTop={8}>
              {VALIDATEUR_LINK_TEXT}
            </Alert>
          </Dialog>

          {error && (
            <Alert marginBottom={16} intent='danger' title='Erreur'>
              <Text>
                {error}
              </Text>
            </Alert>
          )}

          <Button height={40} type='submit' appearance='primary' intent='success' disabled={Boolean(error) || !file} isLoading={isLoading} iconAfter={isLoading ? null : PlusIcon}>
            {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale'}
          </Button>
        </Form>
      </Pane>

      <Alert margin={16} title='Vous disposez déjà d’une Base Adresse Locale au format CSV gérée à partir d’un autre outil ?' marginY={16}>
        <Text>
          Utilisez notre formulaire de dépôt afin de publier vos adresses dans la Base Adresse Nationale.
        </Text>
        <Pane marginTop={16}>
          <Button appearance='primary' iconBefore={InboxIcon} is='a' href='https://adresse.data.gouv.fr/bases-locales/publication'>Accéder au formulaire de dépôt d’une Base Adresse Locale sur adresse.data.gouv.fr</Button>
        </Pane>
      </Alert>
    </>
  )
}

export default UploadForm
