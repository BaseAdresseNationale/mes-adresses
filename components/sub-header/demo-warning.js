import {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Text, Button, Dialog, TextInputField, WarningSignIcon} from 'evergreen-ui'

import {transformToDraft} from '@/lib/bal-api'

import {useInput} from '@/hooks/input'
import useFocus from '@/hooks/focus'

function DemoWarning({baseLocale, communeName, token}) {
  const {_id} = baseLocale
  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [nom, setNom] = useState()
  const [email, onEmailChange] = useInput()
  const [focusRef] = useFocus()

  const onSubmit = useCallback(async e => {
    e.preventDefault()
    setIsLoading(true)

    await transformToDraft(
      _id,
      {
        nom: nom ? nom.trim() : null,
        email
      },
      token
    )

    Router.push(`/bal?balId=${_id}`,
      `/bal/${_id}`)
  }, [_id, token, email, nom])

  useEffect(() => {
    setNom(`Adresses de ${communeName}`)

    return () => null
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Pane
      position='fixed'
      top={116}
      left={0}
      height={50}
      width='100%'
      backgroundColor='#F7D154'
      elevation={0}
      zIndex={3}
      display='flex'
      flexDirection='column'
      justifyContent='center'
    >
      <div
        style={{margin: 'auto', textAlign: 'center'}}
      >
        <WarningSignIcon size={20} marginX='.5em' style={{verticalAlign: 'sub'}} />
        <Text>
          Cette Base Adresse Locale de démonstration sera supprimée d’ici 24 heures sans modifications
        </Text>
        <Dialog
          isShown={isShown}
          title='Sauvegarder mes modifications'
          cancelLabel='Annuler'
          intent='success'
          isConfirmLoading={isLoading}
          confirmLabel='Conserver'
          hasFooter={false}
          onCloseComplete={() => setIsShown(false)}
        >
          <form onSubmit={onSubmit}>

            <TextInputField
              ref={focusRef}
              required
              autoComplete='new-password' // Hack to bypass chrome autocomplete
              name='nom'
              id='nom'
              disabled={isLoading}
              value={nom}
              label='Nom de la Base Adresse Locale'
              placeholder={communeName}
              onChange={e => setNom(e.target.value)}
            />

            <TextInputField
              required
              type='email'
              name='email'
              id='email'
              disabled={isLoading}
              value={email}
              label='Votre adresse email'
              placeholder='nom@example.com'
              onChange={onEmailChange}
            />
            <Button appearance='primary' intent='success' isLoading={isLoading} type='submit' >Sauvegarder</Button>
          </form>
        </Dialog>
        <Button height={24} marginX='.5em' onClick={() => setIsShown(true)}>Je souhaite la conserver</Button>
      </div>
    </Pane>
  )
}

DemoWarning.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    commune: PropTypes.string.isRequired
  }).isRequired,
  communeName: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
}

export default DemoWarning
