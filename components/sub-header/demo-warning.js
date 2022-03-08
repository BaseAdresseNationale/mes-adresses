import {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Text, Button, Dialog, TextInputField, WarningSignIcon} from 'evergreen-ui'

import {useInput} from '@/hooks/input'
import useFocus from '@/hooks/focus'

import {getCommune} from '@/lib/geo-api'
import {transformToDraft} from '@/lib/bal-api'

function DemoWarning({baseLocale, token}) {
  const {_id, communes} = baseLocale
  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
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

    if (communes.length === 1) {
      Router.push(`/bal/communes?balId=${_id}&codeCommune=${communes[0]}`,
        `/bal/${_id}/communes/${communes[0]}`)
    } else {
      Router.push(`/bal/${_id}`)
    }
  }, [_id, communes, token, email, nom])

  useEffect(() => {
    const fetchCommune = async code => {
      if (communes.length > 0) {
        const commune = await getCommune(code)
        setPlaceholder(commune.nom)
        setNom(`Adresses de ${commune.nom}`)
      }
    }

    fetchCommune(communes[0])
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
              placeholder={placeholder}
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
    communes: PropTypes.array.isRequired
  }).isRequired,
  token: PropTypes.string.isRequired
}

export default DemoWarning
