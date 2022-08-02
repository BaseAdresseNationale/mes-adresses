import {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Text, Button, Dialog, TextInputField, WarningSignIcon, toaster} from 'evergreen-ui'

import {transformToDraft} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import {useInput} from '@/hooks/input'
import useFocus from '@/hooks/focus'

function DemoWarning({baseLocale, communeName}) {
  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [nom, setNom] = useState(`Adresses de ${communeName}`)
  const [email, onEmailChange] = useInput()
  const [focusedElement] = useFocus(true)

  const {reloadBaseLocale} = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  const onSubmit = useCallback(async e => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await transformToDraft(
        baseLocale._id, {
          nom: nom ? nom.trim() : null,
          email
        },
        token
      )

      await reloadBaseLocale()
    } catch (error) {
      toaster.danger('Impossible de conserver cette Base Adresse Locale', {
        description: error.message
      })
    }

    setIsShown(false)
    setIsLoading(false)
  }, [baseLocale._id, token, email, nom, reloadBaseLocale])

  return (
    <Pane
      width='100%'
      textAlign='center'
      backgroundColor='#F7D154'
      position='fixed'
      bottom={0}
      height={50}
      display='flex'
      alignItems='center'
      justifyContent='center'
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
        onOpenComplete={() => focusedElement.current.focus()}
      >
        <form onSubmit={onSubmit}>

          <TextInputField
            ref={focusedElement}
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

      <Button height={24} marginX='.5em' width='fit-content' onClick={() => setIsShown(true)}>Je souhaite la conserver</Button>
    </Pane>
  )
}

DemoWarning.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  communeName: PropTypes.string.isRequired
}

export default DemoWarning
