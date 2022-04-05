import {colors} from '@/lib/colors'

export function filterByStatus(basesLocales, status) {
  return basesLocales.filter(bal => {
    return bal.status === status
  })
}

export function getBALByStatus(basesLocalesStatsByStatus) {
  return [
    {
      label: basesLocalesStatsByStatus.nbBALPublished > 1 ? 'Publiées' : 'Publiée',
      values: basesLocalesStatsByStatus.nbBALPublished,
      color: colors.green
    },
    {
      label: basesLocalesStatsByStatus.nbBALReplaced > 1 ? 'Remplacées' : 'Remplacée',
      values: basesLocalesStatsByStatus.nbBALReplaced,
      color: colors.red
    },
    {
      label: basesLocalesStatsByStatus.nbBALReadyToPublished > 1 ? 'Prêtes à être publiées' : 'Prête à être publiée',
      values: basesLocalesStatsByStatus.nbBALReadyToPublished,
      color: colors.blue
    },
    {
      label: basesLocalesStatsByStatus.nbBALDraft > 1 ? 'Brouillons' : 'Brouillon',
      values: basesLocalesStatsByStatus.nbBALDraft,
      color: colors.neutral
    }
  ]
}
