import {Pane, Heading, Button, Icon, ArrowLeftIcon, RouteIcon} from 'evergreen-ui'
import Link from 'next/Link'
import Header from '../components/header'

function Custom404() {
  return (
    <Pane display='flex' backgroundColor='#fff' flexDirection='column' width='100%' height='100%'>
      <Header />
      <Pane
        display='flex'
        alignItems='center'
        flexDirection='column'
        justifyContent='center'
        height='50%'
      >
        <Icon icon={RouteIcon} size={100} marginX='auto' marginY={16} color='#101840' />
        <Heading size={800} marginBottom='2em'>Erreur 404 - Page introuvable</Heading>
        <Link href='/' passHref>
          <Button iconBefore={ArrowLeftIcon} is='a'>
            Retour à la page d’accueil
          </Button>
        </Link>
      </Pane>
    </Pane>
  )
}

export default Custom404
