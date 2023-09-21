import Fullscreen from '@/layouts/fullscreen'

import Footer from '@/components/footer'

interface MainProps {
  children: React.ReactNode;
}

function Main({children}: MainProps) {
  return (
    <Fullscreen>
      {children}
      <Footer />
    </Fullscreen>
  )
}

export default Main
