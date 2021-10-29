import {useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Button, Paragraph, ManualIcon} from 'evergreen-ui'

import HelpContext from '../contexts/help'
import useHelp from '../hooks/help'

function DocumentationLink({title, description, link, onClick}) {
  return (
    <Pane display='flex' flexDirection='column' alignItems='center'>
      {link ? (
        <Button iconBefore={ManualIcon} is='a' appearance='minimal' height={30} href={link} target='_blank' fontSize='0.8em'>
          {title}
        </Button>
      ) : (
        <Button iconBefore={ManualIcon} appearance='minimal' height={30} fontSize='0.8em' onClick={onClick}>
          {title}
        </Button>
      )}

      <Paragraph marginTop={4} textAlign='center' fontStyle='italic'>
        <small>{description}</small>
      </Paragraph>
    </Pane>
  )
}

DocumentationLink.defaultProps = {
  link: null,
  onClick: null
}

DocumentationLink.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string,
  onClick: PropTypes.func
}

function Footer() {
  const {showHelp, setShowHelp, setSelectedIndex} = useContext(HelpContext)

  useHelp(0)

  const handleHelp = useCallback(() => {
    setSelectedIndex(0)
    setShowHelp(!showHelp)
  }, [setSelectedIndex, setShowHelp, showHelp])

  return (
    <div>
      <Pane
        bottom={0}
        background='tint1'
        padding={16}
        elevation={1}
      >
        <Pane>
          <Heading textAlign='center' marginBottom={2} size={600}>Besoin d’aide ?</Heading>
        </Pane>
        <Pane display='grid' gridTemplateColumns='1fr 1fr' justifyContent='space-between' alignItems='center'>
          <DocumentationLink
            title='Guides de l’adressage'
            description='Pour vous accompagner dans la gestion des adresses de votre commune'
            link='https://adresse.data.gouv.fr/guides'
          />
          <DocumentationLink
            title='Guide interactif'
            description='Le manuel de l’éditeur toujours à porté de main'
            onClick={handleHelp}
          />
        </Pane>
      </Pane>
    </div>
  )
}

export default Footer
