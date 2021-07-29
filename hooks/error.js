import {useState, useEffect} from 'react'
import {toaster} from 'evergreen-ui'

export default function useError(error) {
  const [err, setError] = useState(error)

  useEffect(() => {
    if (err) {
      toaster.danger('Une erreur est survenue', {
        description: err,
      })
    }
  }, [err])

  return [setError]
}
