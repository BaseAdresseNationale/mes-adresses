import {useState, useEffect} from 'react'

export function useLocalStorage(key, value) {
  const [data, setData] = useState()

  const getData = () => {
    return JSON.parse(localStorage.getItem(key))
  }

  const storeData = value => {
    localStorage.setItem(key, JSON.stringify(value))
    setData(value)
  }

  const getIndex = index => {
    const data = getData()

    return data ? data[index] : null
  }

  const addIndex = (index, value) => {
    const previous = getData()

    storeData({
      ...previous,
      [index]: value
    })
  }

  const removeIndex = index => {
    const data = getData()
    delete data[index]

    storeData(data)
  }

  // Initializes with data already stored if none is provided
  useEffect(() => {
    if (value) {
      storeData(value)
    } else {
      const v = getData()
      setData(v)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return [data, storeData, getIndex, addIndex, removeIndex]
}
