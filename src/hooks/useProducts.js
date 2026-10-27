import { useCallback, useEffect, useState } from 'react'
import { apiError, productApi } from '../services/productApi'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  const reload = useCallback(() => setReloadToken((value) => value + 1), [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await productApi.getAll()
        if (!cancelled) setProducts(data)
      } catch (err) {
        if (!cancelled) setError(apiError(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [reloadToken])

  return { products, loading, error, reload }
}
