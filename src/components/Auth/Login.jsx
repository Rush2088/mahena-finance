import { useState } from 'react'
import { supabase } from '../../supabase/client'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-gray-400"

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f3f4f4' }}>
      <div className="w-full max-w-sm">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="text-2xl font-medium tracking-widest mb-1" style={{ color: '#1a3020', letterSpacing: '0.2em' }}>
            <span style={{ color: '#c9a84c' }}>Ma'he'na</span> Estate
          </div>
          <div className="text-xs tracking-widest" style={{ color: '#9ca3af', letterSpacing: '0.15em' }}>
            Finance Tracker
          </div>
          <div className="mt-4 mx-auto" style={{ width: 40, height: 2, background: '#c9a84c' }} />
        </div>

        {/* Login card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-sm font-medium text-gray-700 mb-6 text-center tracking-wide">Sign in to your account</h2>

          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Email address</label>
              <input
                type="email" required autoComplete="email"
                className={inputCls}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Password</label>
              <input
                type="password" required autoComplete="current-password"
                className={inputCls}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white mt-2 cursor-pointer transition-opacity"
              style={{ background: '#1a3020', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Batepolea, Waturagam, Sri Lanka
        </p>
      </div>
    </div>
  )
}
