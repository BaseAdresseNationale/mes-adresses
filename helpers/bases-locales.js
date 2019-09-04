import {getPublishedBasesLocales} from '../lib/adresse-backend'

export const expandWithPublished = async basesLocales => {
  const publishedBasesLocales = await getPublishedBasesLocales()
  basesLocales.forEach(baseLocale => {
    baseLocale.published = Boolean(publishedBasesLocales.find(bal => bal.url.includes(baseLocale._id)))
  })

  return publishedBasesLocales
}
