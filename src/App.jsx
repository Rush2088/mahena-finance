import { useState } from 'react'
import TopBar from './components/Layout/TopBar'
import Dashboard from './components/Dashboard/Dashboard'
import Transactions from './components/Transactions/Transactions'
import Statements from './components/Statements/Statements'
import Login from './components/Auth/Login'
import { useTransactions } from './hooks/useTransactions'
import { useAuth } from './hooks/useAuth'
import './index.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const { session, loading: authLoading, signOut } = useAuth()
  const txnData = useTransactions(session?.user?.email)

  // Still checking session
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f3f4f4' }}>
        <div className="text-sm text-gray-400">Loading…</div>
      </div>
    )
  }

  // Not logged in → show login screen
  if (!session) return <Login />

  // Logged in → show the app
  return (
    <div className="min-h-screen py-4 px-2" style={{ background: '#f3f4f4' }}>
      <div className="max-w-6xl mx-auto shadow-lg overflow-hidden" style={{ borderRadius: '10px', border: '1px solid #e2e2e2' }}>
        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userEmail={session.user.email}
          onSignOut={signOut}
        />
        {activeTab === 'Dashboard'    && <Dashboard    {...txnData} />}
        {activeTab === 'Transactions' && <Transactions {...txnData} />}
        {activeTab === 'Statements'   && <Statements   {...txnData} />}
      </div>
    </div>
  )
}
