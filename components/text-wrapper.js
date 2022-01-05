import {useState} from 'react'
import PropTypes from 'prop-types'
import {Text, Strong, Icon, CaretUpIcon, CaretDownIcon} from 'evergreen-ui'

function TextWrapper({placeholder, isOpenDefault, children}) {
  const [isOpen, setIsOpen] = useState(isOpenDefault)

  return (
    <>
      <Text
        display='flex'
        alignItems='center'
        textDecoration='underline'
        cursor='pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <Strong fontSize={12}>{placeholder}</Strong>
        <Icon icon={isOpen ? CaretUpIcon : CaretDownIcon} />
      </Text>

      {isOpen && children}
    </>
  )
}

TextWrapper.defaultProps = {
  placeholder: 'En savoir plus',
  isOpenDefault: false
}

TextWrapper.propTypes = {
  placeholder: PropTypes.string,
  isOpenDefault: PropTypes.bool,
  children: PropTypes.node.isRequired
}

export default TextWrapper
