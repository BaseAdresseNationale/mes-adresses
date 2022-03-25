import PropTypes from 'prop-types'

import Fullscreen from '@/layouts/fullscreen'

import Footer from '@/components/footer'

function Main({children}) {
  return (
    <Fullscreen>
      {children}
      <Footer />
    </Fullscreen>
  )
}

Main.propTypes = {
  children: PropTypes.node.isRequired
}

export default Main
