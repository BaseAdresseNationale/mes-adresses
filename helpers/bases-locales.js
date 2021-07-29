import {getPublishedBasesLocales} from '../lib/adresse-backend'

export const expandWithPublished = async basesLocales => {
  const publishedBasesLocales = await getPublishedBasesLocales()
  for (const baseLocale of basesLocales) {
    baseLocale.published = Boolean(publishedBasesLocales.find(bal => bal.url.includes(baseLocale._id)))
  }

  return publishedBasesLocales
}
