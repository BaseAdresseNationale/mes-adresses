import {useState, useEffect, useCallback} from 'react'

type UseLocalStorageType = [
  data: any,
  storeData: (value: any) => void,
  getIndex: (index: string) => any,
  addIndex: (index: string, value: any) => void,
  removeIndex: (index: string) => void
]

export function useLocalStorage(key: string, value: any = undefined): UseLocalStorageType {
  const [data, setData] = useState<any>()

  // Initializes with data already stored if none is provided
  useEffect(() => {
    if (value) {
      storeData(value)
    } else {
      const v = getData()
      setData(v)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const storeData = useCallback((value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
    setData(value)
  }, [key, setData])

  const getData = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch {
      // Prevent from corrupt data like discovered with recovery-email-sent
      storeData(null)
      return null
    }
  }, [key, storeData])

  const getIndex = useCallback((index: string | number) => {
    const data = getData()

    return data ? data[index] : null
  }, [getData])

  const addIndex = useCallback((index, value) => {
    const previous = getData()

    storeData({
      ...previous,
      [index]: value
    })
  }, [getData, storeData])

  const removeIndex = useCallback((index: string | number) => {
    const data = getData()
    delete data[index]

    storeData(data)
  }, [getData, storeData])

  return [data, storeData, getIndex, addIndex, removeIndex]
}
