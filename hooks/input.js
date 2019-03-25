import {useState, useCallback} from 'react'

export function useInput(initialValue) {
  const [value, setValue] = useState(initialValue || '')

  const onChange = useCallback(e => {
    setValue(e.target.value)
  }, [])

  return [value, onChange]
}

export function useCheckboxInput(initialValue) {
  const [checked, setChecked] = useState(initialValue || false)

  const onChange = useCallback(e => {
    setChecked(e.target.checked)
  }, [])

  return [checked, onChange]
}
