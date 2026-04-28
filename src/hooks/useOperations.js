// ─────────────────────────────────────────────
//  Supabase CRUD hook for operations journal
// ─────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase/client'

export function useOperations(userEmail, crop, ready = false) {
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchAll = useCallback(async () => {
    if (!crop) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('operations_journal')
      .select('*')
      .eq('crop', crop)
      .order('date', { ascending: false })
    if (error) setError(error.message)
    else setEntries(data || [])
    setLoading(false)
  }, [crop])

  useEffect(() => { if (ready && crop) fetchAll() }, [fetchAll, ready, crop])

  const addEntry = async (entry) => {
    const payload = { ...entry, crop, entered_by: userEmail || null }
    const { data, error } = await supabase
      .from('operations_journal')
      .insert([payload])
      .select()
    if (error) { setError(error.message); return null }
    setEntries(prev => [data[0], ...prev])
    return data[0]
  }

  const updateEntry = async (id, updates) => {
    const { id: _id, created_at, entered_by, crop: _crop, ...safeUpdates } = updates
    const { data, error } = await supabase
      .from('operations_journal')
      .update(safeUpdates)
      .eq('id', id)
      .select()
    if (error) { setError(error.message); return null }
    setEntries(prev => prev.map(e => e.id === id ? data[0] : e))
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
