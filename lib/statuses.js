import {TimeIcon, TickCircleIcon, PauseIcon, ErrorIcon, CircleArrowUpIcon, ManuallyEnteredDataIcon, LabTestIcon} from 'evergreen-ui'

import {colors} from '../lib/colors'

const STATUSES = {
  conflict: {
    label: 'Conflit',
    title: 'Cette Base Adresse Locale n’alimente plus la Base Adresse Nationale',
    content: 'Une autre Base Adresses Locale est aussi synchronisée avec la Base Adresse Nationale. Veuillez entrer en contact les administrateurs de l’autre Base Adresse Locale ou notre support: adresse@data.gouv.fr',
    color: 'red',
    intent: 'danger',
    icon: ErrorIcon
  },
  paused: {
    label: 'Suspendue',
    title: 'Les mises à jour automatiques de cette Base Adresse Locale sont actuellement suspendues, elle n’alimente plus la Base Adresse Nationale',
    content: 'Les mises à jour automatiques de cette Base Adresse Locale sont actuellement suspendues. Vous pouvez relancer la synchronisation à tout moment.',
    color: 'yellow',
    intent: 'warning',
    icon: PauseIcon,
  },
  outdated: {
    label: 'Mise à jour programmée',
    title: 'Cette Base Adresse Locale va alimenter la Base Adresse Nationale',
    content: 'De nouvelles modifications ont été détectées, elles seront automatiquement répercutées dans la Base Adresse Nationale dans les prochaines heures.',
    color: 'blue',
    intent: 'none',
    icon: TimeIcon
  },
  synced: {
    label: 'À jour',
    title: 'Cette Base Adresse Locale alimente la Base Adresse Nationale',
    content: 'Cette Base Adresse Locale est à jour avec la Base Adresse Nationale. Toute modification sera automatiquement répercutée dans la Base Adresse Nationale dans les prochaines heures.',
    color: 'green',
    intent: 'success',
    icon: TickCircleIcon,
  },
  'ready-to-publish': {
    content: 'Cette Base Adresse Locale est désormais prête à être publiée',
    label: 'Prête à être publiée',
    color: 'blue',
    intent: 'none',
    icon: CircleArrowUpIcon
  },
  draft: {
    content: 'Cette Base Adresses Locale est en cours de construction',
    label: 'Brouillon',
    color: 'neutral',
    icon: ManuallyEnteredDataIcon
  },
  demo: {
    content: 'Base Adresse Locale de démonstration, aucune adresse ne sera transmise à la Base Adresse Nationale',
    label: 'Démonstration',
    color: colors.neutral,
    icon: LabTestIcon
  }
}

export function computeStatus(balStatus, sync) {
  if (balStatus === 'replaced' || sync?.status === 'conflict') {
    return STATUSES.conflict
  }

  if (sync?.isPaused) {
    return STATUSES.paused
  }

  if (balStatus === 'published') {
    return STATUSES[sync.status]
  }

  return STATUSES[balStatus]
}
