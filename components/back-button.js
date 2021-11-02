import React, {forwardRef} from 'react'
import {ArrowLeftIcon, Button} from 'evergreen-ui'

const BackButton = React.memo(
  forwardRef(({children = 'Retour', ...props}, ref) => {
    return (
      <Button iconBefore={ArrowLeftIcon} {...props} ref={ref} >
        {children}
      </Button >
    )
  })
)

BackButton.propTypes = {
  ...Button.propTypes
}

export default BackButton
