import PropTypes from 'prop-types'
import Image from 'next/image'
import {Pane, UnorderedList, ListItem, Tooltip, Position, HelpIcon} from 'evergreen-ui'

import availableFlags from '../../available-flags.json'

function LanguagePreview({nomAlt}) {
  const isFlagExist = availableFlags.includes(Object.keys(nomAlt)[0])

  return (
    Object.keys(nomAlt).length > 1 ? (
      <Pane fontStyle='italic' fontSize={14} fontWeight='lighter'>
        <Tooltip
          content={
            <UnorderedList display='flex' flexDirection='column' padding={0} margin={0}>
              {Object.keys(nomAlt).map(language => (
                <ListItem
                  key={language}
                  color='white'
                  listStyleType='hidden'
                  display='grid'
                  alignItems='start'
                  gridTemplateColumns='22px 1fr'
                  gap={8}
                  marginLeft={-15}
                >
                  <Image
                    src={isFlagExist ? `/static/images/flags/${language}.svg` : '/images/icons/flags/ntr.svg'}
                    height={22}
                    width={22}
                  />
                  {nomAlt[language]}
                </ListItem>
              ))}
            </UnorderedList>
          }
          position={Position.BOTTOM_LEFT}
        >
          <Pane fontSize={12} display='flex' alignItems='center' gap='5px'>
            <HelpIcon size={12} />Afficher les alternatives régionales
          </Pane>
        </Tooltip>
      </Pane>
    ) : (
      <Pane fontStyle='italic' fontWeight='lighter' display='flex' gap={8} alignItems='center'>
        <Image
          src={isFlagExist ? `/static/images/flags/${Object.keys(nomAlt)[0]}.svg` : '/static/images/flags/ntr.svg'}
          height={18}
          width={18}
        />
        <Pane fontWeight='lighter' fontSize={14}>{nomAlt[Object.keys(nomAlt)]}</Pane>
      </Pane>
    )
  )
}

LanguagePreview.propTypes = {
  nomAlt: PropTypes.object.isRequired
}

export default LanguagePreview
