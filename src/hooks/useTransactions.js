// ─────────────────────────────────────────────
//  Supabase CRUD hook for transactions
// ─────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase/client'

export function useTransactions(userEmail) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
    if (error) setError(error.message)
    else setTransactions(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addTransaction = async (txn) => {
    const payload = { ...txn, entered_by: userEmail || null }
    const { data, error } = await supabase
      .from('transactions')
      .insert([payload])
      .select()
    if (error) { setError(error.message); return null }
    setTransactions(prev => [data[0], ...prev])
    return data[0]
  }

  const updateTransaction = async (id, updates) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) { setError(error.message); return null }
    setTransactions(prev => prev.map(t => t.id === id ? data[0] : t))
    return data[0]
  }

  const deleteTransaction = async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
    if (error) { setError(error.message); return false }
    setTransactions(prev => prev.filter(t => t.id !== id))
    return true
  }

  return { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction, refetch: fetchAll }
}
