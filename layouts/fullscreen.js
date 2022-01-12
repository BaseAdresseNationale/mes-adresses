import {Pane} from 'evergreen-ui'

function Fullscreen({...props}) {
  return (
    <Pane
      display='flex'
      width='100%'
      height='100hv'
      flex={1}
      flexDirection='column'
      {...props}
    />
  )
}

export default Fullscreen
