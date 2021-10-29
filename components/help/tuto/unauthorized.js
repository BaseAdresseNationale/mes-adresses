import PropTypes from 'prop-types'
import {Paragraph, Button, EditIcon} from 'evergreen-ui'

import Tuto from '.'

function Unauthorized({title}) {
  return (
    <Tuto title={title}>
      <Paragraph marginTop='default'>
        Assurez vous que
        <Button
          height={24}
          margin={8}
          appearance='primary'
          intent='danger'
          iconBefore={EditIcon}
        >
          Édition impossible
        </Button>
        n’apparaisse pas en haut à droite de votre écran.
      </Paragraph>
      <Paragraph marginTop='default'>
        Il indique que vous n’êtes pas authentifié ou que vous n’avez pas les droits pour modifier cette BAL.
      </Paragraph>
      <Paragraph marginTop='default'>
        Cependant, si vous en êtes bien le propriétaire, il vous suffit de cliquer sur le lien qui vous a été envoyé par mail lors de la création de votre BAL.
      </Paragraph>
    </Tuto>
  )
}

Unauthorized.propTypes = {
  title: PropTypes.string.isRequired
}

export default Unauthorized
