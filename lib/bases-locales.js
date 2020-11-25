import {colors} from './colors'

export function filterByStatus(basesLocales, status) {
  return basesLocales.filter(bal => {
    return status === 'published' ? bal.published : bal.status === status
  })
}

export function getBALByStatus(basesLocales) {
  const sortedBalByStatus = {
    published: basesLocales.filter(({published}) => published),
    readyToPublish: basesLocales.filter(({status}) => status === 'ready-to-publish'),
    draft: basesLocales.filter(({status}) => status === 'draft')
  }

  return [
    {
      label: sortedBalByStatus.published.length > 1 ? 'Publiées' : 'Publiée',
      values: sortedBalByStatus.published.length,
      color: colors.green
    },
    {
      label: sortedBalByStatus.readyToPublish.length > 1 ? 'Prêtes à être publiées' : 'Prête à être publiée',
      values: sortedBalByStatus.readyToPublish.length,
      color: colors.blue
    },
    {
      label: sortedBalByStatus.draft.length > 1 ? 'Brouillons' : 'Brouillon',
      values: sortedBalByStatus.draft.length,
      color: colors.neutral
    }
  ]
}
