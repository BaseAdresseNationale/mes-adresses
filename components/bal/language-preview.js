import {useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {Pane, UnorderedList, ListItem, Tooltip, Position, HelpIcon} from 'evergreen-ui'

function LanguagePreview({nomAlt}) {
  const [isFlagExist, setIsFlagExist] = useState(true)

  return (
    Object.keys(nomAlt).length > 1 ? (
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
    ) : (
      <Pane fontStyle='italic' fontWeight='lighter' display='flex' gap={8} alignItems='center'>
        <Image
          src={isFlagExist ? `/static/images/flags/${Object.keys(nomAlt)[0]}.svg` : '/static/images/flags/ntr.svg'}
          height={18}
          width={18}
          onLoadingComplete={result => result.naturalHeight <= 1 ? setIsFlagExist(false) : setIsFlagExist(true)}
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
