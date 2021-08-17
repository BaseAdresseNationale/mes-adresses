import {useState, useCallback} from 'react'

export function useInput(initialValue) {
  const [value, setValue] = useState(initialValue || '')

  const onChange = useCallback(event => {
    setValue(event.target.value)
  }, [])

  const resetInput = useCallback(forcedValue => {
    setValue(forcedValue || initialValue || '')
  }, [initialValue])

  return [value, onChange, resetInput]
}

export function useCheckboxInput(initialValue) {
  const [checked, setChecked] = useState(initialValue || false)

  const onChange = useCallback(event => {
    setChecked(event.target.checked)
  }, [])

  return [checked, onChange]
}
