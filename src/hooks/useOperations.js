// ─────────────────────────────────────────────
//  Supabase CRUD hook for operations journal
// ─────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase/client'

export function useOperations(userEmail, cropFilter, ready = false) {
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    let query = supabase
      .from('operations_journal')
      .select('*')
      .order('date', { ascending: false })
    if (cropFilter && cropFilter !== 'all') {
      query = query.eq('crop', cropFilter)
    }
    const { data, error } = await query
    if (error) setError(error.message)
    else setEntries(data || [])
    setLoading(false)
  }, [cropFilter])

  useEffect(() => { if (ready) fetchAll() }, [fetchAll, ready])

  const addEntry = async (entry) => {
    const payload = { ...entry, entered_by: userEmail || null }
    const { data, error } = await supabase
      .from('operations_journal')
      .insert([payload])
      .select()
    if (error) { setError(error.message); return null }
    setEntries(prev => [data[0], ...prev])
    return data[0]
  }

  const updateEntry = async (id, updates) => {
    // Strip fields that must not be overwritten (primary key, audit cols)
    const { id: _id, created_at, entered_by, ...safeUpdates } = updates
    const { data, error } = await supabase
      .from('operations_journal')
      .update(safeUpdates)
      .eq('id', id)
      .select()
    if (error) { setError(error.message); return null }
    // If a crop filter is active and the crop changed, remove from local list
    if (cropFilter && cropFilter !== 'all' && data[0].crop !== cropFilter) {
      setEntries(prev => prev.filter(e => e.id !== id))
    } else {
      setEntries(prev => prev.map(e => e.id === id ? data[0] : e))
    }
    return data[0]
  }

  const deleteEntry = async (id) => {
    const { error } = await supabase
      .from('operations_journal')
      .delete()
      .eq('id', id)
    if (error) { setError(error.message); return false }
    setEntries(prev => prev.filter(e => e.id !== id))
    return true
  }

  return { entries, loading, error, addEntry, updateEntry, deleteEntry, refetch: fetchAll }
}
