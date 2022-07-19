import PropTypes from 'prop-types'
import Image from 'next/image'
import {Pane, UnorderedList, ListItem, Tooltip, Position, HelpIcon} from 'evergreen-ui'

function LanguagePreview({nomAlt, hasIcon}) {
  if (Object.keys(nomAlt).length > 1) {
    return (
      <Pane fontStyle='italic' fontSize={14} fontWeight='lighter'>
        <Tooltip
          content={
            <UnorderedList>
              {Object.keys(nomAlt).map(language => (
                <ListItem color='white' key={language}>
                  {nomAlt[language]}
                </ListItem>
              ))}
            </UnorderedList>
          }
          position={Position.BOTTOM_LEFT}
          padding={0}
          margin={0}
        >
          <Pane fontSize={12} display='flex' alignItems='center' gap='5px'>
            <HelpIcon size={12} />Afficher les alternatives régionales
          </Pane>
        </Tooltip>
      </Pane>
    )
  }

  if (hasIcon && Object.keys(nomAlt).length === 1) {
    return (
      <Pane fontStyle='italic' fontWeight='lighter' display='flex' gap={8} alignItems='center'>
        <Image src={`/static/images/flags/${Object.keys(nomAlt)[0]}.svg`} height={22} width={22} />
        <Pane fontWeight='lighter' fontSize={16}>{nomAlt[Object.keys(nomAlt)]}</Pane>
      </Pane>
    )
  }

  return (
    <Pane fontStyle='italic' fontSize={14} fontWeight='lighter'>
      {nomAlt[Object.keys(nomAlt)]}
    </Pane>
  )
}

LanguagePreview.propTypes = {
  nomAlt: PropTypes.object.isRequired,
  hasIcon: PropTypes.bool
}

LanguagePreview.defaultProps = {
  hasIcon: false
}

export default LanguagePreview
