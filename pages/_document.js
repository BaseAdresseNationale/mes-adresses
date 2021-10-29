import NextDocument, {Html, Head, Main, NextScript} from 'next/document'
import {extractStyles} from 'evergreen-ui'

class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx)
    const {css, hydrationScript} = extractStyles()

    return {
      ...initialProps,
      css,
      hydrationScript
    }
  }

  render() {
    const {css, hydrationScript} = this.props

    return (
      <Html lang='fr'>
        <Head>
          <style>{`
            html {
              height: 100%;
            }

            body {
              height: 100%;
              margin: 0;
            }

            #__next {
              height: 100%;
              display: -webkit-box;
              display: -moz-box;
              display: -ms-flexbox;
              display: -webkit-flex;
              display: flex;
            }
          `}</style>
          {/* eslint-disable-next-line react/no-danger */}
          <style dangerouslySetInnerHTML={{__html: css}} />
        </Head>
        <body>
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
