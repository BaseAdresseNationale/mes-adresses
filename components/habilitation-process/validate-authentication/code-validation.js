import {useState} from 'react'
import PropTypes from 'prop-types'
import NextImage from 'next/image'
import {Pane, Heading, Text, Link, TextInput, IconButton, TickIcon} from 'evergreen-ui'

import Form from '../../form'
import FormInput from '../../form-input'

function CodeValidation({email, handleSubmit, resendCode}) {
  const [code, setCode] = useState('')

  const onSubmit = event => {
    event.preventDefault()
    handleSubmit(code)
    setCode('')
  }

  return (
    <Pane flexDirection='column' marginX='-32px'>
      <Pane display='flex' alignItems='center' margin={16} gap={8}>
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
                  type='number'
                  value={code}
                  textAlign='center'
                  height={40}
                  width='80%'
                  fontSize='xxx-large'
                  maxLength='6'
                  placeholder='Entrez votre code ici'
                  onChange={event => setCode(event.target.value)}
                />
                <IconButton
                  appearance='primary'
                  intent='success'
                  size='large'
                  marginLeft={16}
                  disabled={code.length !== 6}
                  onClick={onSubmit}
                  icon={TickIcon}
                />
              </Pane>
            </Pane>
          </FormInput>
        </Pane>
      </Form>

      <Pane marginX='auto' marginTop={16} marginBottom='-16px' textAlign='center'>
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
