import {useState, useEffect} from 'react'
import {toaster} from 'evergreen-ui'

export default function useError(error) {
  const [error_, setError] = useState(error)

  useEffect(() => {
    if (error_) {
      toaster.danger('Une erreur est survenue', {
        description: error_,
      })
    }
  }, [error_])

  return [setError]
}
