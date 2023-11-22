import {getBaseEditorProps} from '@/layouts/editor'
import BaseLocalePage from './index'

export async function getServerSideProps({params}) {
  const {balId, token} = params

  try {
    const {baseLocale, commune, voies, toponymes} = await getBaseEditorProps(balId)

    return {
      props: {
        baseLocale,
        commune,
        voies,
        toponymes,
        token
      }
    }
  } catch {
    return {
      error: {
        statusCode: 404
      }
    }
  }
}

export default BaseLocalePage
