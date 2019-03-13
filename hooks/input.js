import {useState, useCallback} from 'react'

export function useInput(initialValue, prop = 'value') {
  const [value, setValue] = useState(initialValue)

  const onChange = useCallback(e => {
    setValue(e.target[prop])
  }, [])

  return [value, onChange]
}

export function useCheckboxInput(initialValue) {
  return useInput(initialValue, 'checked')
}
