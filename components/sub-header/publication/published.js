import React from 'react'
import {Badge, Position, Tooltip} from 'evergreen-ui'

function Published() {
  return (
    <Tooltip
      position={Position.BOTTOM_LEFT}
      content="Votre BAL est désormais publiée ! Pour la mettre à jour, il vous suffit de l'éditer ici et les changements seront appliqués d'ici quelques jours"
    >
      <Badge
        color='green'
        marginRight={8}
        paddingTop={2}
        height={20}
      >
        Publiée
      </Badge>
    </Tooltip>
  )
}

export default React.memo(Published)
