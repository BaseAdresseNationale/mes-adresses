import {useState} from 'react'
import PropTypes from 'prop-types'
import NextImage from 'next/image'
import {Pane, Heading, Text, Link, TextInput, IconButton, TickIcon} from 'evergreen-ui'

import Form from '@/components/form'
import FormInput from '@/components/form-input'

function CodeValidation({email, handleSubmit, resendCode}) {
  const [code, setCode] = useState('')
  const [codeMask, setCodeMask] = useState('______')

  const onSubmit = event => {
    event.preventDefault()
    handleSubmit(code)
    setCode('')
  }

  const handleCode = event => {
    // Récupérer la valeur de l'input
    const {value} = event.target

    // Supprimer tout ce qui n'est pas un chiffre dans l'input (lettres et caractères spéciaux)
    const input = value.replaceAll('_', '').replace(/\D/, '')

    if (input.length < 7) {
      // Si on efface, supprimer la dernière valeur de l'input
      const hasMissingNumbers = value.length < 6 && code.length < 6
      const newCode = input.slice(0, hasMissingNumbers ? -1 : 6)

      // On set code avec la bonne valeur, cleané de tout caractères spéciaux
      setCode(newCode)
      // On set codeMask avec les bonnes valeurs + les underscores pour les chiffres encore manquants
      setCodeMask(newCode.padEnd(6, '_'))
    }
  }

  return (
    <Pane flexDirection='column' marginX='-32px'>
      <Pane display='flex' alignItems='center' flexDirection='column' margin={16} gap={8}>
        <NextImage width={54} height={54} src='/static/images/mairie.svg' alt='logo mairie' />
        <Heading is='h2'>Authentification de la mairie</Heading>
      </Pane>

      <Form>
        <Pane display='flex' flexDirection='column' alignItems='center' textAlign='center' width='100%'>
          <FormInput>
            <Pane display='flex' flexDirection='column'>
              <Heading is='h3'>Entrez le code qui vous a été envoyé à l’adresse : {email}</Heading>
              <Pane display='flex' justifyContent='center' marginY={16}>
                <TextInput
                  autoFocus
                  name='code'
                  type='text'
                  value={codeMask}
                  placeholder='Entrez votre code ici'
                  textAlign='center'
                  width='70%'
                  size='fit-content'
                  fontSize={32}
                  height={50}
                  fontWeight='bold'
                  letterSpacing={10}
                  paddingY={16}
                  style={{caretColor: 'transparent'}}
                  onChange={handleCode}
                />

                <IconButton
                  appearance='primary'
                  intent='success'
                  size='large'
                  marginLeft={16}
                  height={50}
                  disabled={code.length !== 6}
                  onClick={onSubmit}
                  icon={TickIcon}
                />
              </Pane>
            </Pane>
          </FormInput>
        </Pane>
      </Form>

      <Pane marginX='auto' marginTop={16} marginBottom={16} textAlign='center'>
        <Text>Vous n’avez pas reçu votre code ?</Text>
        <Pane cursor='pointer' onClick={resendCode}><Link>Renvoyer un code</Link></Pane>
      </Pane>
    </Pane>
  )
}

CodeValidation.propTypes = {
  email: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resendCode: PropTypes.func.isRequired
}

export default CodeValidation
