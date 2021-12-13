import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import NextImage from 'next/image'
import {Pane, Heading, Button, Text, Icon, HistoryIcon, StatusIndicator, Spinner} from 'evergreen-ui'

import {getRevisions} from '../../../lib/ban-api'

function BANHistory({codeCommune}) {
  const [revisions, setRevisions] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isLimited, setIsLimited] = useState(true)

  useEffect(() => {
    async function fetchRevision() {
      const revisions = await getRevisions(codeCommune)
      const publishedRevisions = revisions
        .filter(r => r.status === 'published')
        .reverse() // Sort by date

      setRevisions(publishedRevisions)
      setIsLoading(false)
    }

    setIsLoading(true)
    fetchRevision()
  }, [codeCommune])

  return (
    <Pane>
      <Heading is='h3' display='flex' alignItems='center' marginY={8}>
        Historique de mise à jour <Icon icon={HistoryIcon} marginLeft={4} />
      </Heading>
      {isLoading ? (
        <Pane display='flex'>
          <Spinner marginRight={8} size={22} />
          <Text fontStyle='italic'>Chargement de l’historique</Text>
        </Pane>
      ) : (
        <>
          {revisions.length > 0 ? (
            <Pane display='flex' flexDirection='column' justifyContent='center' gap={4}>
              {revisions.slice(0, isLimited ? 3 : -1).map(revision => (
                <Pane is='li' key={revision._id} display='flex' alignItems='center' gap={8}>
                  <StatusIndicator color={revision.current ? 'success' : 'disabled'} />
                  <Text>{new Date(revision.publishedAt).toLocaleDateString()}</Text>
                  <Text>Mise à jour par : {revision.client.nom}</Text>
                  <Pane>{revision.current && (
                    <NextImage
                      src='/static/images/ban-logo.png'
                      alt='Logo Base Adresses Nationale'
                      width={24}
                      height={24}
                    />
                  )}</Pane>
                </Pane>
              ))}
            </Pane>
          ) : (
            <Text color='muted'>Aucune Base Adresses Locales trouvée</Text>
          )}

          <Pane display='flex' justifyContent='center' >
            <Button appearance='minimal' marginTop={8} onClick={() => setIsLimited(isLimited => !isLimited)}>
              {isLimited ? 'Afficher tout l’historique' : 'Réduire'}
            </Button>
          </Pane>
        </>
      )}
    </Pane>
  )
}

BANHistory.propTypes = {
  codeCommune: PropTypes.string.isRequired
}

export default React.memo(BANHistory)
