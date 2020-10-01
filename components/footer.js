import React, {useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Button, Paragraph} from 'evergreen-ui'

import HelpContext from '../contexts/help'
import useHelp from '../hooks/help'

const Doc = ({text, link, isClickable, onClick}) => (
  <Pane display='flex' flexDirection='column' alignItems='center'>
    {isClickable ? (
      <Button iconBefore='manual' appearance='minimal' height={56} onClick={onClick}>Guide interactif</Button>
    ) : (
      <Button iconBefore='download' is='a' appearance='minimal' height={56} href={link} fontSize='1em'>Guide de l’éditeur de Base Adresse Locale</Button>
    )}
    <Paragraph textAlign='center' fontStyle='italic'>
      <small>{text}</small>
    </Paragraph>
  </Pane>
)

Doc.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string,
  isClickable: PropTypes.bool,
  onClick: PropTypes.func
}

Doc.defaultProps = {
  link: null,
  isClickable: false,
  onClick: null
}

const Footer = () => {
  const {showHelp, setShowHelp, setSelectedIndex} = useContext(HelpContext)

  useHelp(0)

  const handleHelp = useCallback(() => {
    setSelectedIndex(0)
    setShowHelp(!showHelp)
  }, [setSelectedIndex, setShowHelp, showHelp])

  return (
    <Pane
      position='absolute'
      bottom={0}
      background='tint1'
      padding={16}
    >
      <Pane>
        <Heading textAlign='center' marginBottom={5} size={600}>Besoin d’aide ?</Heading>
      </Pane>
      <Pane display='grid' gridTemplateColumns='1fr 1fr 1fr' justifyContent='space-between' alignItems='center'>
        <Doc
          text='Apprendre à utiliser les fonctionnalités essentielles de l’éditeur'
          link='https://adresse.data.gouv.fr/data/docs/guide-editeur-bal-v1.2.pdf'
        />
        <Doc
          isClickable
          text='Apprendre à utiliser les fonctionnalités essentielles de l’éditeur'
          onClick={handleHelp}
        />
        <Doc
          text='Les bonnes pratiques pour nommer et numéroter les voies'
          link='https://adresse.data.gouv.fr/data/docs/guide-bonnes-pratiques-v1.0.pdf'
        />
      </Pane>
    </Pane>
  )
}

export default Footer
