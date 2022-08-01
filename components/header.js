import {useContext} from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import {Pane, Button, Link, HelpIcon, BookIcon, WalkIcon} from 'evergreen-ui'

import HelpContext from '@/contexts/help'

function Header() {
  const {showHelp, setShowHelp} = useContext(HelpContext)

  return (
    <Pane borderBottom padding={16} backgroundColor='white' display='flex' justifyContent='space-between' alignItems='center' flexShrink='0' width='100%' maxHeight={76}>
      <Pane cursor='pointer'>
        <NextLink href='/'>
          <a>
            <Image className='img' height='34' width='304' src='/static/images/mes-adresses.svg' alt='Page d’accueil du site mes-adresses.data.gouv.fr' />
          </a>
        </NextLink>
      </Pane>
      <Pane display='flex' justifyContent='space-around' alignItems='center'>
        <Button
          appearance='minimal' marginRight='12px' minHeight='55px'
          iconAfter={HelpIcon}
          onClick={() => setShowHelp(!showHelp)}
        >
          Besoin d’aide
        </Button>

        <Button appearance='minimal' marginRight='12px' minHeight='55px' iconAfter={BookIcon}>
          <Link href='https://adresse.data.gouv.fr/guides' textDecoration='none' color='neutral' target='_blank'>
            Guides de l’adressage
          </Link>
        </Button>

        <Button appearance='minimal' marginRight='12px' minHeight='55px' iconAfter={WalkIcon}>
          <Link href='/accessibility' textDecoration='none' color='neutral'>
            Accessibilité : non-conforme
          </Link>
        </Button>
      </Pane>
    </Pane>
  )
}

export default Header
