import {BaseEditorReturn, getBaseEditorProps} from '@/layouts/editor'
import BaseLocalePage from './index'

export async function getServerSideProps({params}) {
  const {balId, token}: {balId: string, token: string} = params

  try {
    const {baseLocale, commune, voies, toponymes}: BaseEditorReturn = await getBaseEditorProps(balId)

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
